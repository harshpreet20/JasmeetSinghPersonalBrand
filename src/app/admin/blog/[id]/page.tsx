'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Blog {
  id: string
  slug: string
  title: string
  meta_title: string | null
  meta_description: string | null
  target_keyword: string | null
  content_draft: string | null
  content_html: string | null
  status: string
  tags: string[] | null
  featured_image_url: string | null
  seo_score: number | null
  aeo_score: number | null
  geo_score: number | null
  readability_score: number | null
  ranking_probability: number | null
  ai_citation_probability: number | null
  seo_analysis_json: Record<string, unknown> | null
  seo_analyzed_at: string | null
  published_at: string | null
}

function ScoreBar({ label, value }: { label: string; value: number | null }) {
  if (value == null) return null
  const color = value >= 75 ? '#16a34a' : value >= 50 ? '#d97706' : '#dc2626'
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className="h-2 rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold w-10 text-right" style={{ color }}>{value}/100</span>
    </div>
  )
}

export default function BlogEditor() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<Record<string, unknown> | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [targetKeyword, setTargetKeyword] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [tags, setTags] = useState('')
  const [featuredImageUrl, setFeaturedImageUrl] = useState('')
  const [content, setContent] = useState('')

  const lastSavedContent = useRef('')
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetch(`/api/admin/blogs/${id}`)
      .then(r => r.json())
      .then((data: Blog) => {
        setBlog(data)
        setTitle(data.title || '')
        setSlug(data.slug || '')
        setTargetKeyword(data.target_keyword || '')
        setMetaTitle(data.meta_title || '')
        setMetaDescription(data.meta_description || '')
        setTags((data.tags || []).join(', '))
        setFeaturedImageUrl(data.featured_image_url || '')
        setContent(data.content_draft || '')
        lastSavedContent.current = data.content_draft || ''
        if (data.seo_analysis_json) {
          setAnalysisResult(data.seo_analysis_json)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!blog?.slug || blog.slug === 'untitled-post') {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    }
  }

  const getPayload = useCallback(() => ({
    title,
    slug,
    target_keyword: targetKeyword || null,
    meta_title: metaTitle || null,
    meta_description: metaDescription || null,
    tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    featured_image_url: featuredImageUrl || null,
    content_draft: content,
  }), [title, slug, targetKeyword, metaTitle, metaDescription, tags, featuredImageUrl, content])

  const saveDraft = useCallback(async (silent = false) => {
    if (!silent) setSaving(true)
    try {
      await fetch(`/api/admin/blogs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getPayload())
      })
      lastSavedContent.current = content
    } finally {
      if (!silent) setSaving(false)
    }
  }, [id, getPayload, content])

  // Auto-save every 30s if changed
  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => {
      if (content !== lastSavedContent.current) {
        saveDraft(true)
      }
    }, 30000)
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    }
  }, [content, saveDraft])

  const publish = async () => {
    setPublishing(true)
    try {
      await fetch(`/api/admin/blogs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...getPayload(),
          status: 'published',
          published_at: new Date().toISOString(),
        })
      })
      router.push('/admin/blog')
    } finally {
      setPublishing(false)
    }
  }

  const analyze = async () => {
    if (!targetKeyword) {
      alert('Please set a target keyword before analyzing.')
      return
    }
    setAnalyzing(true)
    try {
      const res = await fetch('/api/admin/analyze-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogId: id,
          keyword: targetKeyword,
          contentHtml: content,
          metaTitle,
          metaDescription,
        })
      })
      const result = await res.json()
      setAnalysisResult(result)
    } finally {
      setAnalyzing(false)
    }
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  // Extract scores from analysis result
  const getScore = (result: Record<string, unknown> | null, ...keys: string[]): number | null => {
    if (!result) return null
    const data = (result.data as Record<string, unknown>) || result
    for (const key of keys) {
      if (data[key] != null) return data[key] as number
    }
    return null
  }

  const seoScore = getScore(analysisResult, 'seoScore', 'seo_score') ?? blog?.seo_score
  const aeoScore = getScore(analysisResult, 'aeoScore', 'aeo_score') ?? blog?.aeo_score
  const geoScore = getScore(analysisResult, 'geoScore', 'geo_score') ?? blog?.geo_score
  const readabilityScore = getScore(analysisResult, 'readabilityScore', 'readability_score') ?? blog?.readability_score
  const rankingProb = getScore(analysisResult, 'rankingProbability', 'ranking_probability') ?? blog?.ranking_probability
  const citationProb = getScore(analysisResult, 'aiCitationProbability', 'ai_citation_probability') ?? blog?.ai_citation_probability

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!blog) {
    return <p className="text-red-500">Blog post not found.</p>
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/admin/blog')} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
          ← Back to Blog List
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => saveDraft()}
            disabled={saving}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={publish}
            disabled={publishing}
            className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column: Editor (60%) */}
        <div className="lg:w-[60%] space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            {/* Title */}
            <div>
              <input
                type="text"
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Post title..."
                className="w-full text-2xl font-bold text-gray-900 border-none outline-none placeholder-gray-300 bg-transparent"
              />
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-400">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="text-xs text-gray-500 border-none outline-none bg-transparent flex-1"
                  placeholder="slug"
                />
              </div>
            </div>

            {/* Target Keyword */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Target Keyword — required for SEO analysis
              </label>
              <input
                type="text"
                value={targetKeyword}
                onChange={e => setTargetKeyword(e.target.value)}
                placeholder="e.g. best stream after class 10"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              />
            </div>

            {/* Meta title */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Meta Title
                <span className={`ml-2 font-normal ${metaTitle.length > 60 ? 'text-amber-500' : 'text-gray-400'}`}>
                  {metaTitle.length}/60{metaTitle.length > 60 ? ' — too long' : ''}
                </span>
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={e => setMetaTitle(e.target.value)}
                placeholder="SEO-optimized page title"
                className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] ${metaTitle.length > 60 ? 'border-amber-300' : 'border-gray-200'}`}
              />
            </div>

            {/* Meta description */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Meta Description
                <span className={`ml-2 font-normal ${metaDescription.length > 160 ? 'text-amber-500' : 'text-gray-400'}`}>
                  {metaDescription.length}/160{metaDescription.length > 160 ? ' — too long' : ''}
                </span>
              </label>
              <textarea
                value={metaDescription}
                onChange={e => setMetaDescription(e.target.value)}
                placeholder="Page description for search results"
                rows={2}
                className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] resize-none ${metaDescription.length > 160 ? 'border-amber-300' : 'border-gray-200'}`}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="e.g. class 10, stream selection, parents"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              />
              <p className="text-xs text-gray-400 mt-0.5">Comma-separated</p>
            </div>

            {/* Featured image */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Featured Image URL</label>
              <input
                type="url"
                value={featuredImageUrl}
                onChange={e => setFeaturedImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              />
            </div>
          </div>

          {/* Content editor */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div data-color-mode="light">
              <MDEditor
                value={content}
                onChange={val => setContent(val || '')}
                height={500}
                preview="edit"
              />
            </div>
          </div>

          {/* Button row */}
          <div className="flex gap-3">
            <button
              onClick={() => saveDraft()}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={publish}
              disabled={publishing}
              className="px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
            >
              {publishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Right column: SEO Panel (40%) */}
        <div className="lg:w-[40%] space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">SEO Analysis</h3>
              <span className="text-xs text-gray-400">{wordCount.toLocaleString()} words</span>
            </div>

            <button
              onClick={analyze}
              disabled={analyzing}
              className="w-full flex items-center justify-center gap-2 bg-[#7C3AED] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#6D28D9] transition-colors disabled:opacity-60"
            >
              {analyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze with SearchIntel'
              )}
            </button>

            {blog.seo_analyzed_at && (
              <p className="text-xs text-gray-400">
                Last analyzed: {new Date(blog.seo_analyzed_at).toLocaleString('en-IN')}
              </p>
            )}

            {(rankingProb != null || citationProb != null) && (
              <div className="grid grid-cols-2 gap-3">
                {rankingProb != null && (
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-green-600">{rankingProb}%</p>
                    <p className="text-xs text-green-500 mt-0.5">Ranking Probability</p>
                  </div>
                )}
                {citationProb != null && (
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-[#7C3AED]">{citationProb}%</p>
                    <p className="text-xs text-purple-400 mt-0.5">AI Citation</p>
                  </div>
                )}
              </div>
            )}

            {(seoScore != null || aeoScore != null || geoScore != null || readabilityScore != null) && (
              <div className="space-y-3">
                <ScoreBar label="SEO Score" value={seoScore ?? null} />
                <ScoreBar label="AEO Score" value={aeoScore ?? null} />
                <ScoreBar label="GEO Score" value={geoScore ?? null} />
                <ScoreBar label="Readability" value={readabilityScore ?? null} />
              </div>
            )}

            {!analysisResult && !blog.seo_analysis_json && (
              <p className="text-xs text-gray-400 text-center py-4">
                Add a target keyword and click Analyze to get your SEO scores.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
