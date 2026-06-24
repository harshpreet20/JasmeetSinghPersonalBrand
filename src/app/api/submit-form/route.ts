import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function sendLeadNotification({ name, email, phone, message, form_name, source_url, notify_email }: {
  name: string; email: string; phone?: string; message?: string; form_name: string; source_url?: string; notify_email?: string;
}) {
  const NOTIFY_EMAIL = notify_email || process.env.NOTIFY_EMAIL || "harshpreet@hotbotstudios.com";
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) return; // Skip silently if not configured

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#f5f4ff;font-family:Inter,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(124,58,237,0.10);">
    <!-- Header -->
    <div style="background:#0A0A10;padding:28px 32px;display:flex;align-items:center;gap:16px;">
      <div style="width:44px;height:44px;border-radius:12px;background:#7C3AED;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <span style="color:white;font-weight:900;font-size:18px;">JC</span>
      </div>
      <div>
        <p style="color:white;font-weight:800;font-size:16px;margin:0;">New Lead Alert</p>
        <p style="color:#8B5CF6;font-size:12px;margin:4px 0 0;text-transform:uppercase;letter-spacing:0.1em;">Jasmeet Chandhok · Career Counselling</p>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <p style="color:#374151;font-size:15px;margin:0 0 24px;line-height:1.6;">
        A new enquiry just came in through your website. Here are the details:
      </p>

      <!-- Details card -->
      <div style="background:#f9f8ff;border:1px solid #ede9ff;border-radius:14px;padding:20px 24px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #ede9ff;width:120px;">
              <span style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;">Name</span>
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #ede9ff;">
              <span style="font-size:14px;font-weight:700;color:#111827;">${name || "Not provided"}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #ede9ff;">
              <span style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;">Email</span>
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #ede9ff;">
              <a href="mailto:${email}" style="font-size:14px;color:#7C3AED;text-decoration:none;font-weight:600;">${email}</a>
            </td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #ede9ff;">
              <span style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;">Phone</span>
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #ede9ff;">
              <a href="tel:${phone}" style="font-size:14px;color:#7C3AED;text-decoration:none;font-weight:600;">${phone}</a>
            </td>
          </tr>` : ""}
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #ede9ff;">
              <span style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;">Form</span>
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #ede9ff;">
              <span style="font-size:14px;color:#374151;">${form_name}</span>
            </td>
          </tr>
          ${source_url ? `
          <tr>
            <td style="padding:8px 0;">
              <span style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;">Source</span>
            </td>
            <td style="padding:8px 0;">
              <span style="font-size:13px;color:#6B7280;">${source_url}</span>
            </td>
          </tr>` : ""}
        </table>
      </div>

      ${message ? `
      <!-- Message -->
      <div style="margin-bottom:28px;">
        <p style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">Their Message</p>
        <div style="background:#f9fafb;border-left:3px solid #7C3AED;border-radius:0 10px 10px 0;padding:14px 18px;">
          <p style="font-size:14px;color:#374151;margin:0;line-height:1.7;">${message.replace(/\n/g, "<br/>")}</p>
        </div>
      </div>` : ""}

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:8px;">
        <a href="mailto:${email}?subject=Re: Your enquiry to Jasmeet Chandhok&body=Hi ${name},%0A%0AThank you for reaching out! I'd love to schedule a free clarity call with you.%0A%0ABest,%0AJasmeet"
          style="display:inline-block;background:#7C3AED;color:white;font-weight:700;font-size:14px;padding:14px 32px;border-radius:100px;text-decoration:none;">
          Reply to ${name || "this lead"} →
        </a>
      </div>

      <p style="text-align:center;font-size:12px;color:#9CA3AF;margin:16px 0 0;">
        Lead received at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f9f8ff;border-top:1px solid #ede9ff;padding:16px 32px;text-align:center;">
      <p style="font-size:11px;color:#9CA3AF;margin:0;">
        jasmeetchandhok.com · Admin dashboard: <a href="https://jasmeetchandhok.com/admin" style="color:#7C3AED;text-decoration:none;">jasmeetchandhok.com/admin</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Jasmeet Website <leads@jasmeetchandhok.com>",
      to: [NOTIFY_EMAIL],
      subject: `New Lead: ${name || email} — ${form_name}`,
      html,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { form_name, name, email, phone, message, source_url, notify_email } = body;

    if (!form_name || !email) {
      return NextResponse.json({ error: "form_name and email are required" }, { status: 400 });
    }

    const supabase = getSupabase();
    let saved = false;

    // Save to form_submissions if DB is configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await supabase.from("form_submissions").insert({
          form_name,
          name: name ?? "Unknown",
          email,
          phone: phone ?? null,
          problem_statement: message ?? null,
          source_page: source_url ?? req.headers.get("referer") ?? null,
          status: "new",
          data: body,
        });
        saved = true;
      } catch (dbErr) {
        console.error("[submit-form] DB error:", dbErr);
        // Continue — still send notification
      }
    }

    // Send email notification
    await sendLeadNotification({ name, email, phone, message, form_name, source_url, notify_email });

    return NextResponse.json({ success: true, saved });
  } catch (err: unknown) {
    console.error("[submit-form]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
