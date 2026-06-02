import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Blog {
  id: string
  slug: string
  title: string
  meta_title: string | null
  meta_description: string | null
  content_html: string | null
  content_draft: string | null
  author: string
  tags: string[] | null
  published_at: string | null
  featured_image_url: string | null
  view_count: number
  seo_score: number | null
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('blogs')
    .select('title, meta_title, meta_description, featured_image_url')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!data) return {}

  return {
    title: data.meta_title || data.title,
    description: data.meta_description || undefined,
    openGraph: {
      title: data.meta_title || data.title,
      description: data.meta_description || undefined,
      images: data.featured_image_url ? [data.featured_image_url] : undefined,
    },
  }
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!blog) notFound()

  const post = blog as Blog

  const textContent = post.content_html ? stripHtml(post.content_html) : (post.content_draft || '')
  const wc = wordCount(textContent)
  const readingTime = Math.ceil(wc / 200)

  // Related posts (overlapping tags, excluding current)
  let relatedPosts: { id: string; slug: string; title: string; published_at: string | null }[] = []
  if (post.tags && post.tags.length > 0) {
    const { data: related } = await supabase
      .from('blogs')
      .select('id, slug, title, published_at')
      .eq('status', 'published')
      .neq('slug', slug)
      .overlaps('tags', post.tags)
      .limit(3)
    relatedPosts = related || []
  }

  // Fire-and-forget view count (server-side via fetch)
  // This is intentionally not awaited
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  fetch(`${baseUrl}/api/blog/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug }),
  }).catch(() => {})

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.meta_title || post.title,
    description: blog.meta_description || undefined,
    author: { '@type': 'Person', name: post.author || 'Jasmeet Singh' },
    datePublished: post.published_at,
    image: post.featured_image_url || undefined,
    url: `https://jasmeetsingh.com/blog/${post.slug}`,
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0A0A0F] via-[#1a0a2e] to-[#0A0A0F] text-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="text-[#A78BFA] text-sm hover:underline mb-4 inline-block">
            ← All Posts
          </Link>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map(tag => (
                <span key={tag} className="bg-[#7C3AED]/20 text-[#A78BFA] text-xs font-semibold px-2 py-0.5 rounded-full border border-[#7C3AED]/30">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span>By {post.author || 'Jasmeet Singh'}</span>
            {post.published_at && (
              <span>{new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            )}
            <span>{readingTime} min read</span>
          </div>
        </div>
      </div>

      {/* Featured image */}
      {post.featured_image_url && (
        <div className="max-w-3xl mx-auto px-6 -mt-8">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full rounded-2xl shadow-lg object-cover max-h-80"
          />
        </div>
      )}

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-10">
        {post.content_html ? (
          <div
            className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-[#7C3AED] prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />
        ) : (
          <p className="text-gray-400">No content yet.</p>
        )}
      </article>

      {/* Author bio */}
      <div className="max-w-3xl mx-auto px-6 pb-10">
        <div className="bg-[#F5F4FF] rounded-2xl p-6 flex gap-4 items-start border border-purple-100">
          <div className="w-12 h-12 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            J
          </div>
          <div>
            <p className="font-bold text-gray-900">Jasmeet Singh</p>
            <p className="text-sm text-gray-500 mb-2">Career Counsellor & Education Coach for Indian Families</p>
            <Link href="/#contact" className="text-sm text-[#7C3AED] font-semibold hover:underline">
              Book a Free Consultation →
            </Link>
          </div>
        </div>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-16">
          <h3 className="font-bold text-gray-800 text-lg mb-4">Related Posts</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {relatedPosts.map(r => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="group">
                <div className="bg-gray-50 rounded-xl p-4 hover:bg-purple-50 transition-colors border border-gray-100">
                  <p className="font-semibold text-gray-800 text-sm group-hover:text-[#7C3AED] transition-colors line-clamp-2">
                    {r.title}
                  </p>
                  {r.published_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(r.published_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
