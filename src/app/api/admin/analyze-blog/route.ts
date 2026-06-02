import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { blogId, keyword, contentHtml, metaTitle, metaDescription } = await req.json()

    if (!keyword || !contentHtml) {
      return NextResponse.json({ error: 'keyword and contentHtml are required' }, { status: 400 })
    }

    const response = await fetch('https://api.searchintel.ai/api/n8n/analyze', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SEARCHINTEL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        keyword,
        content: contentHtml,
        location: 'in',
        domainUrl: 'https://jasmeetsingh.com',
        metaTitle: metaTitle || '',
        metaDescription: metaDescription || ''
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return NextResponse.json({ error: (error as { message?: string }).message || 'Analysis failed' }, { status: response.status })
    }

    const result = await response.json()
    const data = result.data || result

    if (blogId) {
      await supabase
        .from('blogs')
        .update({
          seo_score: data.seoScore ?? data.seo_score,
          aeo_score: data.aeoScore ?? data.aeo_score,
          geo_score: data.geoScore ?? data.geo_score,
          readability_score: data.readabilityScore ?? data.readability_score,
          ranking_probability: data.rankingProbability ?? data.ranking_probability,
          ai_citation_probability: data.aiCitationProbability ?? data.ai_citation_probability,
          seo_analysis_json: result,
          seo_analyzed_at: new Date().toISOString(),
          status: 'analyzed'
        })
        .eq('id', blogId)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('SearchIntel error:', error)
    return NextResponse.json({ error: 'Analysis request failed' }, { status: 500 })
  }
}
