import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePublishedPosts } from '../../hooks/usePosts'
import { useAuth } from '../../hooks/useAuth'
import PostCard from '../../components/PostCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import SearchModal from '../../components/SearchModal'

const BASE = import.meta.env.BASE_URL

// 背景图：选择其中一张固定展示
const BG_IMAGE = `${BASE}images/bg/1.jpg`

const SECTIONS = [
  { key: 'home', label: 'HOME', icon: '🏠', desc: '回到首页', tag: null },
  { key: 'research', label: 'RESEARCH', icon: '🔬', desc: '研究探索', tag: 'research' },
  { key: 'knowledge', label: 'KNOWLEDGE', icon: '📚', desc: '知识积累', tag: 'knowledge' },
  { key: 'ideas', label: 'IDEAS', icon: '💡', desc: '灵感火花', tag: 'ideas' },
  { key: 'notes', label: 'NOTES', icon: '📝', desc: '日常笔记', tag: 'notes' },
  { key: 'share', label: 'SHARE', icon: '🤝', desc: '分享交流', tag: 'share' },
]

export default function HomePage() {
  const [page, setPage] = useState(1)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const { posts, total, loading } = usePublishedPosts(page)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const filteredPosts = useMemo(() => {
    if (!activeTag) return posts
    return posts.filter(
      (p) => p.tags && p.tags.some((t) => t.toLowerCase() === activeTag)
    )
  }, [posts, activeTag])

  const totalPages = Math.ceil(total / 10)

  const handleSectionClick = (section: (typeof SECTIONS)[0]) => {
    if (section.tag) {
      setActiveTag(activeTag === section.tag ? null : section.tag)
      setPage(1)
    } else {
      setActiveTag(null)
      setPage(1)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden min-h-[70vh] flex items-center">
        {/* Fixed blurred background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url(${BG_IMAGE})`,
            filter: 'blur(12px)',
            transform: 'scale(1.1)',
          }}
        />

        {/* Teal green overlay */}
        <div className="absolute inset-0 bg-teal-900/55" />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Animated gradient orbs — teal & emerald */}
        <div className="absolute top-[-15%] right-[-8%] w-[400px] h-[400px] rounded-full bg-teal-400/15 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-5%] w-[350px] h-[350px] rounded-full bg-emerald-400/12 blur-[100px]" />

        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-28 w-full">
          <div className="max-w-2xl">
            {/* Blog title — clean & minimal */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
              我的博客
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-lg">
              记录思考，分享发现，探索知识的无限可能。
            </p>
            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('posts')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-6 py-3 bg-white text-teal-800 rounded-xl font-medium hover:bg-teal-50 transition-all cursor-pointer shadow-lg shadow-teal-500/25"
              >
                浏览文章
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="px-6 py-3 border border-white/30 text-white rounded-xl font-medium hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm"
              >
                了解更多
              </button>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
              className="fill-teal-50"
            />
          </svg>
        </div>
      </section>

      {/* Section Navigation Cards */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 relative z-10 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {SECTIONS.map((section) => {
            const isActive = activeTag === section.tag || (!activeTag && section.key === 'home')
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => handleSectionClick(section)}
                className={`group flex flex-col items-center gap-1.5 p-4 rounded-xl transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? 'bg-teal-50 border-teal-200 shadow-md shadow-teal-100/50 -translate-y-1'
                    : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                <span className="text-2xl transition-transform group-hover:scale-110">
                  {section.icon}
                </span>
                <span className={`text-[11px] font-semibold tracking-wider ${
                  isActive ? 'text-teal-700' : 'text-gray-600'
                }`}>
                  {section.label}
                </span>
                <span className="text-[10px] text-gray-400 hidden lg:block">
                  {section.desc}
                </span>
              </button>
            )
          })}
        </div>

        {/* Active filter indicator */}
        {activeTag && (
          <div className="flex items-center justify-center mt-4 gap-2">
            <span className="text-sm text-gray-500">
              筛选标签：<span className="font-semibold text-teal-600 uppercase">{activeTag}</span>
            </span>
            <button
              type="button"
              onClick={() => { setActiveTag(null); setPage(1) }}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              ✕ 清除
            </button>
          </div>
        )}
      </section>

      {/* Posts Section */}
      <section id="posts" className="max-w-5xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTag ? activeTag.toUpperCase() : '最新文章'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {activeTag ? `标签 "${activeTag}" 下的文章` : `共 ${total} 篇文章`}
            </p>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <span className="text-6xl block mb-4">📝</span>
            <p className="text-lg">
              {activeTag ? `还没有标签为 "${activeTag}" 的文章` : '还没有发布任何文章'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {!activeTag && totalPages > 1 && (
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
                        ? 'bg-teal-600 text-white'
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
      </section>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
