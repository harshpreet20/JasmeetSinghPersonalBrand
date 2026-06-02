import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { slug } = await req.json()
  await supabase.rpc('increment_blog_view', { blog_slug: slug }).catch(() => {})
  return NextResponse.json({ ok: true })
}
