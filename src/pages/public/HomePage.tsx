import { useState } from 'react'
import { usePublishedPosts } from '../../hooks/usePosts'
import PostCard from '../../components/PostCard'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function HomePage() {
  const [page, setPage] = useState(1)
  const { posts, total, loading } = usePublishedPosts(page)
  const totalPages = Math.ceil(total / 10)

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">最新文章</h1>
      <p className="text-gray-500 mb-8">
        共 {total} 篇文章
      </p>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <span className="text-6xl block mb-4">📝</span>
          <p className="text-lg">还没有发布任何文章</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                上一页
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`w-10 h-10 text-sm rounded-lg transition-colors cursor-pointer ${
                    n === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
