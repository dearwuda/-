import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePostById, usePostMutations } from '../../hooks/usePosts'
import RichTextEditor from '../../components/RichTextEditor'
import LoadingSpinner from '../../components/LoadingSpinner'
import ImageUploader from '../../components/ImageUploader'

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id || id === 'new'
  const { post, loading } = usePostById(isNew ? '' : id!)
  const { createPost, updatePost } = usePostMutations()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState<Record<string, unknown>>({})
  const [excerpt, setExcerpt] = useState('')
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [tagsInput, setTagsInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNew && post) {
      setTitle(post.title)
      setSlug(post.slug)
      setContent(post.content)
      setExcerpt(post.excerpt)
      setCoverImage(post.cover_image)
      setTagsInput(post.tags?.join(', ') ?? '')
    }
  }, [isNew, post])

  const generateSlug = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\w一-鿿]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 100) || `post-${Date.now()}`
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (isNew) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: FormEvent, shouldPublish: boolean) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('请输入文章标题')
      return
    }

    const tags = tagsInput
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean)

    const postData = {
      title: title.trim(),
      slug: slug || generateSlug(title),
      content,
      excerpt,
      cover_image: coverImage,
      tags,
      published: shouldPublish,
    }

    setSaving(true)

    if (isNew) {
      const { data, error } = await createPost(postData)
      setSaving(false)

      if (error) {
        alert('创建失败：' + error.message)
        return
      }

      if (data) {
        navigate(`/admin/editor/${data.id}`)
      }
    } else {
      const { error } = await updatePost(id!, postData)
      setSaving(false)

      if (error) {
        alert('保存失败：' + error.message)
        return
      }
    }

    alert(shouldPublish ? '已发布！' : '已保存为草稿')
  }

  if (!isNew && loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">
        {isNew ? '新建文章' : '编辑文章'}
      </h1>

      <form className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标题
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="文章标题"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL 别名
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
            placeholder="article-url-slug"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            封面图片
          </label>
          <div className="flex items-center gap-3">
            <ImageUploader onUpload={(url) => setCoverImage(url)} buttonText="上传封面图" />
            {coverImage && (
              <div className="flex items-center gap-2">
                <img
                  src={coverImage}
                  alt="封面预览"
                  className="h-10 w-16 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                >
                  移除
                </button>
              </div>
            )}
          </div>
          {coverImage && (
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full mt-2 px-3 py-1.5 border border-gray-200 rounded text-xs font-mono text-gray-500"
              placeholder="封面图 URL"
            />
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标签（逗号分隔）
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="技术, 生活, 随笔"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            摘要
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            placeholder="文章简短摘要..."
            rows={3}
          />
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            正文
          </label>
          <RichTextEditor
            content={content}
            onChange={setContent}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={saving}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 cursor-pointer"
          >
            {saving ? '保存中...' : '保存草稿'}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={saving}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 cursor-pointer"
          >
            {saving ? '发布中...' : '发 布'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="px-5 py-2.5 text-gray-500 hover:text-gray-700 transition-colors text-sm cursor-pointer ml-auto"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}
