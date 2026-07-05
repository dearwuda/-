import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchPosts } from '../lib/supabase'
import type { Post } from '../types'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [keyword, setKeyword] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [results, setResults] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      setKeyword('')
      setDateFrom('')
      setDateTo('')
      setResults([])
      setSearched(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const handleSearch = async () => {
    if (!keyword.trim() && !dateFrom && !dateTo) return
    setLoading(true)
    setSearched(true)
    const { data } = await searchPosts({
      keyword: keyword.trim() || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    })
    setResults(data ?? [])
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">搜索文章</h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Keyword input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入关键词搜索..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
            />
          </div>

          {/* Date filters */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1">
              <label className="block text-[11px] text-gray-400 mb-1">开始日期</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-teal-400 transition-all cursor-pointer"
              />
            </div>
            <span className="text-gray-300 mt-5">—</span>
            <div className="flex-1">
              <label className="block text-[11px] text-gray-400 mb-1">结束日期</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-teal-400 transition-all cursor-pointer"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="mt-5 px-5 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? '搜索中...' : '搜索'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {!searched ? (
            <div className="px-6 py-16 text-center text-gray-400">
              <span className="text-4xl block mb-3">🔍</span>
              <p className="text-sm">输入关键词或选择日期范围开始搜索</p>
            </div>
          ) : loading ? (
            <div className="px-6 py-16 text-center text-gray-400">
              <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">搜索中...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="px-6 py-16 text-center text-gray-400">
              <span className="text-4xl block mb-3">📭</span>
              <p className="text-sm">没有找到匹配的文章</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              <p className="text-xs text-gray-400 px-2 mb-2">
                找到 {results.length} 篇文章
              </p>
              {results.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => {
                    navigate(`/post/${post.slug}`)
                    onClose()
                  }}
                  className="w-full text-left p-4 rounded-xl hover:bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all cursor-pointer"
                >
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {post.excerpt || '暂无摘要'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-gray-400">
                      {new Date(post.created_at).toLocaleDateString('zh-CN')}
                    </span>
                    {post.tags?.length > 0 && (
                      <div className="flex gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 bg-teal-50 text-teal-600 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
