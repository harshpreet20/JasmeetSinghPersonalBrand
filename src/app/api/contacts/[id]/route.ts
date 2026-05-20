import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [contact, notes, activities, deals, submissions] = await Promise.all([
    supabase.from("crm_contacts").select("*").eq("id", id).single(),
    supabase.from("crm_notes").select("*").eq("contact_id", id).order("created_at", { ascending: false }),
    supabase.from("crm_activities").select("*").eq("contact_id", id).order("created_at", { ascending: false }).limit(50),
    supabase.from("crm_deals").select("*").eq("contact_id", id).order("created_at", { ascending: false }),
    supabase.from("form_submissions").select("*").eq("contact_id", id).order("created_at", { ascending: false }),
  ]);
  if (contact.error) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ contact: contact.data, notes: notes.data, activities: activities.data, deals: deals.data, submissions: submissions.data });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { action } = body;

  if (action === "add_note") {
    const { data, error } = await supabase.from("crm_notes").insert({ contact_id: id, content: body.content, author: body.author ?? "Admin" }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await supabase.from("crm_activities").insert({ contact_id: id, type: "note", title: "Note added", description: body.content.slice(0, 100) });
    return NextResponse.json({ data });
  }

  if (action === "add_deal") {
    const { data, error } = await supabase.from("crm_deals").insert({ contact_id: id, title: body.title, value: body.value, stage: body.stage ?? "lead" }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  const prevContact = await supabase.from("crm_contacts").select("status,pipeline_stage").eq("id", id).single();
  const { error } = await supabase.from("crm_contacts").update({ ...body, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (body.status && prevContact.data?.status !== body.status) {
    await supabase.from("crm_activities").insert({ contact_id: id, type: "status_change", title: `Status changed to "${body.status}"`, metadata: { from: prevContact.data?.status, to: body.status } });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await supabase.from("crm_contacts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
