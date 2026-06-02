import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json()

    // Validate slug format
    if (!slug || typeof slug !== 'string' || slug.length > 255) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
    }

    // Sanitize slug - allow only alphanumeric, hyphens, underscores
    if (!/^[a-z0-9_-]+$/i.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 })
    }

    await getSupabase().rpc('increment_blog_view', { blog_slug: slug })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Blog view error:', error)
    return NextResponse.json({ error: 'Failed to record view' }, { status: 500 })
  }
}
