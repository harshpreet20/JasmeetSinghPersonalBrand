import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get("section");
  const query = supabase.from("site_content").select("*").order("section").order("key");
  const { data, error } = section ? await query.eq("section", section) : await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { section, key, value } = body;
  if (!section || !key) return NextResponse.json({ error: "section and key required" }, { status: 400 });
  const { error } = await supabase
    .from("site_content")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("section", section)
    .eq("key", key);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const updates: { section: string; key: string; value: string }[] = body.updates ?? [body];
  for (const u of updates) {
    await supabase
      .from("site_content")
      .upsert({ section: u.section, key: u.key, value: u.value, updated_at: new Date().toISOString() }, { onConflict: "section,key" });
  }
  return NextResponse.json({ success: true, count: updates.length });
}
