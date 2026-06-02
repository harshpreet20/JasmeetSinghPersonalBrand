'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Blog {
  id: string
  slug: string
  title: string
  target_keyword: string
  status: 'draft' | 'analyzing' | 'analyzed' | 'published'
  seo_score: number | null
  aeo_score: number | null
  ranking_probability: number | null
  created_at: string
  published_at: string | null
}

const STATUS_STYLE: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  analyzing: 'bg-yellow-100 text-yellow-700',
  analyzed: 'bg-blue-100 text-blue-700',
  published: 'bg-green-100 text-green-700',
}

export default function AdminBlogList() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchBlogs = () => {
    fetch('/api/admin/blogs')
      .then(r => r.json())
      .then(setBlogs)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBlogs() }, [])

  const createBlog = async () => {
    setCreating(true)
    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Post', status: 'draft' })
      })
      const data = await res.json()
      if (data.id) router.push(`/admin/blog/${data.id}`)
    } finally {
      setCreating(false)
    }
  }

  const deleteBlog = async (id: string) => {
    await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' })
    setDeleteId(null)
    fetchBlogs()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Blog Posts</h2>
          <p className="text-sm text-gray-500 mt-0.5">{blogs.length} post{blogs.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={createBlog}
          disabled={creating}
          className="flex items-center gap-2 bg-[#7C3AED] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#6D28D9] transition-colors disabled:opacity-60"
        >
          {creating ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>+</span>
          )}
          New Blog
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {blogs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">✍️</p>
            <p className="font-medium">No blog posts yet</p>
            <p className="text-sm mt-1">Click &ldquo;New Blog&rdquo; to get started</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Title</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Target Keyword</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">SEO Score</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Ranking</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {blogs.map(blog => (
                <tr
                  key={blog.id}
                  className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                  onClick={() => router.push(`/admin/blog/${blog.id}`)}
                >
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-gray-800 text-sm truncate max-w-[200px]">{blog.title || 'Untitled'}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">/blog/{blog.slug}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-sm text-gray-600">{blog.target_keyword || '—'}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[blog.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    {blog.seo_score != null ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${blog.seo_score}%`,
                              backgroundColor: blog.seo_score >= 75 ? '#16a34a' : blog.seo_score >= 50 ? '#d97706' : '#dc2626'
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 font-medium">{blog.seo_score}</span>
                      </div>
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    {blog.ranking_probability != null ? (
                      <span className={`text-xs font-semibold ${blog.ranking_probability >= 70 ? 'text-green-600' : blog.ranking_probability >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                        {blog.ranking_probability}%
                      </span>
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-xs text-gray-400">
                      {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setDeleteId(blog.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors text-sm px-2 py-1 rounded"
                      title="Delete"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete post?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteBlog(deleteId)}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
