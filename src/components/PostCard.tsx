import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import type { Post } from '../types'

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/post/${post.slug}`}
      className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      {post.cover_image ? (
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <span className="text-4xl text-blue-300">📝</span>
        </div>
      )}

      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <time>
            {format(new Date(post.created_at), 'yyyy年MM月dd日')}
          </time>

          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
