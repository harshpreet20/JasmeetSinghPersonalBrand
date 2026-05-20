import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { runAutomations } from "@/lib/automation-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { form_name, name, email, phone, company, goals, message, source_url, ...extra } = body;

    if (!form_name || !email) {
      return NextResponse.json({ error: "form_name and email are required" }, { status: 400 });
    }

    // Upsert contact
    const { data: existingContacts } = await supabase
      .from("crm_contacts")
      .select("id,tags,metadata")
      .eq("email", email)
      .limit(1);

    let contactId: string;

    if (existingContacts && existingContacts.length > 0) {
      contactId = existingContacts[0].id;
      await supabase
        .from("crm_contacts")
        .update({ name: name ?? "Unknown", phone, company, updated_at: new Date().toISOString() })
        .eq("id", contactId);
    } else {
      const { data: newContact, error } = await supabase
        .from("crm_contacts")
        .insert({ name: name ?? "Unknown", email, phone, company, goals, source: form_name, metadata: extra })
        .select("id")
        .single();
      if (error) throw error;
      contactId = newContact.id;
    }

    // Record form submission
    await supabase.from("form_submissions").insert({
      form_name,
      contact_id: contactId,
      data: { name, email, phone, company, goals, message, ...extra },
      source_url: source_url ?? req.headers.get("referer"),
    });

    // Record activity
    await supabase.from("crm_activities").insert({
      contact_id: contactId,
      type: "form_submission",
      title: `Submitted "${form_name}" form`,
      description: message ?? goals ?? "",
      metadata: { form_name, data: body },
    });

    // Run automations
    const { data: contact } = await supabase
      .from("crm_contacts")
      .select("*")
      .eq("id", contactId)
      .single();

    await runAutomations({
      trigger: "form_submission",
      contact: { id: contactId, name: name ?? "", email, ...contact },
      form: { name: form_name, data: body },
    });

    if (existingContacts?.length === 0) {
      await runAutomations({
        trigger: "contact_created",
        contact: { id: contactId, name: name ?? "", email },
      });
    }

    return NextResponse.json({ success: true, contact_id: contactId });
  } catch (err: unknown) {
    console.error("[submit-form]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
