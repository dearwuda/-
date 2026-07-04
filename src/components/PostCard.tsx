import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import type { Post } from '../types'

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/post/${post.slug}`}
      className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
    >
      {post.cover_image ? (
        <div className="aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="aspect-[16/10] bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
          <span className="text-5xl opacity-40">📝</span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          {post.tags && post.tags.length > 0 && (
            <span className="text-[11px] font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
              {post.tags[0]}
            </span>
          )}
        </div>

        <h2 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2 leading-snug">
          {post.title}
        </h2>

        {post.excerpt ? (
          <p className="text-gray-400 text-sm line-clamp-2 mb-3 leading-relaxed">
            {post.excerpt}
          </p>
        ) : (
          <p className="text-gray-300 text-sm line-clamp-2 mb-3 leading-relaxed italic">
            暂无摘要
          </p>
        )}

        <time className="text-xs text-gray-300">
          {format(new Date(post.created_at), 'yyyy · MM · dd')}
        </time>
      </div>
    </Link>
  )
}
