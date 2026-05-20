import { supabase } from "./supabase";

export type TriggerType =
  | "form_submission"
  | "contact_created"
  | "status_changed"
  | "tag_added";

export interface AutomationContext {
  trigger: TriggerType;
  contact: { id: string; name: string; email: string; [k: string]: unknown };
  form?: { name: string; data: Record<string, unknown> };
  metadata?: Record<string, unknown>;
}

function interpolate(template: string, ctx: AutomationContext): string {
  return template
    .replace(/\{\{contact\.name\}\}/g, ctx.contact.name)
    .replace(/\{\{contact\.email\}\}/g, ctx.contact.email)
    .replace(/\{\{contact\.id\}\}/g, ctx.contact.id)
    .replace(/\{\{form\.name\}\}/g, ctx.form?.name ?? "")
    .replace(/\{\{name\}\}/g, ctx.contact.name)
    .replace(/\{\{email\}\}/g, ctx.contact.email);
}

async function executeAction(
  action: { type: string; config: Record<string, unknown> },
  ctx: AutomationContext
): Promise<{ success: boolean; output?: unknown; error?: string }> {
  const cfg = action.config as Record<string, string>;

  switch (action.type) {
    case "log":
      console.log("[Automation]", interpolate(cfg.message ?? "", ctx));
      return { success: true, output: { logged: cfg.message } };

    case "send_email": {
      const to = interpolate(cfg.to ?? "", ctx);
      const subject = interpolate(cfg.subject ?? "", ctx);
      const body = interpolate(cfg.body ?? "", ctx);
      console.log(`[Email] To: ${to} | Subject: ${subject}\n${body}`);
      return { success: true, output: { to, subject } };
    }

    case "webhook": {
      const url = cfg.url;
      if (!url) return { success: false, error: "No webhook URL configured" };
      const start = Date.now();
      try {
        const res = await fetch(url, {
          method: cfg.method ?? "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contact: ctx.contact, form: ctx.form, trigger: ctx.trigger }),
        });
        const duration = Date.now() - start;
        const text = await res.text();
        await supabase.from("webhook_logs").insert({
          webhook_id: null,
          event_type: ctx.trigger,
          payload: { contact: ctx.contact },
          response_status: res.status,
          response_body: text.slice(0, 500),
          duration_ms: duration,
        });
        return { success: res.ok, output: { status: res.status } };
      } catch (e: unknown) {
        return { success: false, error: String(e) };
      }
    }

    case "add_tag": {
      const tag = cfg.tag;
      if (tag && ctx.contact.id) {
        const { data: existing } = await supabase
          .from("crm_contacts")
          .select("tags")
          .eq("id", ctx.contact.id)
          .single();
        const tags: string[] = existing?.tags ?? [];
        if (!tags.includes(tag)) {
          await supabase
            .from("crm_contacts")
            .update({ tags: [...tags, tag] })
            .eq("id", ctx.contact.id);
        }
      }
      return { success: true, output: { tag } };
    }

    case "update_pipeline": {
      await supabase
        .from("crm_contacts")
        .update({ pipeline_stage: cfg.stage })
        .eq("id", ctx.contact.id);
      return { success: true, output: { stage: cfg.stage } };
    }

    case "update_status": {
      await supabase
        .from("crm_contacts")
        .update({ status: cfg.status })
        .eq("id", ctx.contact.id);
      return { success: true, output: { status: cfg.status } };
    }

    default:
      return { success: false, error: `Unknown action type: ${action.type}` };
  }
}

export async function runAutomations(ctx: AutomationContext): Promise<void> {
  const { data: automations } = await supabase
    .from("automations")
    .select("*")
    .eq("is_active", true)
    .eq("trigger_type", ctx.trigger);

  for (const auto of automations ?? []) {
    const triggerCfg = auto.trigger_config as Record<string, string>;

    // Filter by form_name if specified
    if (ctx.trigger === "form_submission" && triggerCfg.form_name) {
      if (triggerCfg.form_name !== ctx.form?.name) continue;
    }

    const actions = Array.isArray(auto.actions) ? auto.actions : [];
    const outputs: unknown[] = [];
    let overallStatus: "success" | "failed" = "success";
    let errMsg = "";

    for (const action of actions) {
      const result = await executeAction(
        action as { type: string; config: Record<string, unknown> },
        ctx
      );
      outputs.push(result);
      if (!result.success) {
        overallStatus = "failed";
        errMsg = result.error ?? "Unknown error";
      }
    }

    await supabase.from("automation_logs").insert({
      automation_id: auto.id,
      contact_id: ctx.contact.id || null,
      status: overallStatus,
      input_data: { trigger: ctx.trigger, contact: ctx.contact, form: ctx.form },
      output_data: { actions: outputs },
      error_message: errMsg || null,
    });

    await supabase
      .from("automations")
      .update({ run_count: (auto.run_count ?? 0) + 1, last_run_at: new Date().toISOString() })
      .eq("id", auto.id);
  }
}
