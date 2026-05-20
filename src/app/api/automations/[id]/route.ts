import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [auto, logs] = await Promise.all([
    supabase.from("automations").select("*").eq("id", id).single(),
    supabase.from("automation_logs").select("*, crm_contacts(name,email)").eq("automation_id", id).order("created_at", { ascending: false }).limit(50),
  ]);
  if (auto.error) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ automation: auto.data, logs: logs.data });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { error } = await supabase.from("automations").update({ ...body, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await supabase.from("automations").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
