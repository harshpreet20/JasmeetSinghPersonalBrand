import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

interface Blog {
  id: string
  slug: string
  title: string
  target_keyword: string | null
  content_html: string | null
  ranking_probability: number | null
  featured_image_url: string | null
  published_at: string | null
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function stripMarkdown(md: string): string {
  return md
    .replace(/#+\s/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
}

const GRADIENTS = [
  'from-purple-400 to-indigo-600',
  'from-pink-400 to-rose-600',
  'from-amber-400 to-orange-600',
  'from-teal-400 to-cyan-600',
  'from-green-400 to-emerald-600',
]

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: blogs } = await supabase
    .from('blogs')
    .select('id, slug, title, target_keyword, content_html, ranking_probability, featured_image_url, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const posts = (blogs || []) as Blog[]

  return (
    <div className="min-h-screen bg-[#F5F4FF]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0A0A0F] via-[#1a0a2e] to-[#0A0A0F] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-[#7C3AED]/20 text-[#A78BFA] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-[#7C3AED]/30">
            Career Insights
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Career Guidance for<br />
            <span className="text-[#A78BFA]">Indian Families</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Evidence-based advice on stream selection, higher education, and building a successful career , tailored for Indian students and parents.
          </p>
        </div>
      </div>

      {/* Blog grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No posts yet. Check back soon!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => {
              const excerpt = post.content_html
                ? stripHtml(post.content_html).slice(0, 160) + '...'
                : ''
              const gradient = GRADIENTS[i % GRADIENTS.length]
              const highRanking = (post.ranking_probability ?? 0) >= 70

              return (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
                    {/* Image or gradient placeholder */}
                    <div className="relative h-44 overflow-hidden">
                      {post.featured_image_url ? (
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                          <span className="text-white/30 text-6xl font-extrabold">
                            {post.title?.[0]?.toUpperCase() ?? 'B'}
                          </span>
                        </div>
                      )}
                      {highRanking && (
                        <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          High Ranking Potential
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      {post.target_keyword && (
                        <span className="inline-block bg-[#7C3AED]/10 text-[#7C3AED] text-[11px] font-semibold px-2 py-0.5 rounded-full mb-2 self-start">
                          {post.target_keyword}
                        </span>
                      )}
                      <h2 className="font-bold text-gray-900 text-base mb-2 leading-snug group-hover:text-[#7C3AED] transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      {excerpt && (
                        <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">{excerpt}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-3">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                          : ''}
                      </p>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
