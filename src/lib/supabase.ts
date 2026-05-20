import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

export type ContentMap = Record<string, string>;

export async function getSiteContent(section?: string): Promise<ContentMap> {
  const query = supabase.from("site_content").select("section,key,value");
  const { data } = section ? await query.eq("section", section) : await query;
  const map: ContentMap = {};
  for (const row of data ?? []) {
    map[`${row.section}.${row.key}`] = row.value ?? "";
  }
  return map;
}

export function c(map: ContentMap, section: string, key: string, fallback = ""): string {
  return map[`${section}.${key}`] ?? fallback;
}
