import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAllPosts, usePostMutations } from '../../hooks/usePosts'
import LoadingSpinner from '../../components/LoadingSpinner'
import { format } from 'date-fns'

export default function DashboardPage() {
  const [page, setPage] = useState(1)
  const { posts, total, loading, refresh } = useAllPosts(page)
  const { deletePost } = usePostMutations()
  const [deleting, setDeleting] = useState<string | null>(null)

  const totalPages = Math.ceil(total / 20)

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`确定删除「${title}」？此操作不可撤销。`)) return

    setDeleting(id)
    const { error } = await deletePost(id)
    setDeleting(null)

    if (error) {
      alert('删除失败：' + error.message)
      return
    }

    refresh()
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link
          to="/admin/editor/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + 新建文章
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">还没有文章</p>
          <p>点击「新建文章」开始写作吧</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                    标题
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">
                    状态
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">
                    日期
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 line-clamp-1">
                        {post.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          post.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {post.published ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 hidden md:table-cell">
                      {format(new Date(post.created_at), 'yyyy-MM-dd')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/editor/${post.id}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          编辑
                        </Link>
                        {post.published && (
                          <Link
                            to={`/post/${post.slug}`}
                            className="text-sm text-gray-400 hover:text-gray-600"
                            target="_blank"
                          >
                            查看
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deleting === post.id}
                          className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50 cursor-pointer"
                        >
                          {deleting === post.id ? '删除中...' : '删除'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-30 hover:bg-gray-50 cursor-pointer"
              >
                上一页
              </button>
              <span className="text-sm text-gray-500">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-30 hover:bg-gray-50 cursor-pointer"
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
