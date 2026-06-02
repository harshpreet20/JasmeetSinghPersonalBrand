import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const { slug } = await req.json()
  try { await getSupabase().rpc('increment_blog_view', { blog_slug: slug }) } catch { /* RPC may not exist */ }
  return NextResponse.json({ ok: true })
}
