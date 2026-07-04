import { useParams, Link } from 'react-router-dom'
import { usePostBySlug } from '../../hooks/usePosts'
import LoadingSpinner from '../../components/LoadingSpinner'
import { format } from 'date-fns'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block'
import { VideoExtension } from '../../components/VideoExtension'
import { useEffect } from 'react'

function PostContent({ content }: { content: Record<string, unknown> }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Image,
      LinkExtension,
      CodeBlockLowlight,
      VideoExtension,
    ],
    content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'post-content',
      },
    },
  })

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content as never)
    }
  }, [editor, content])

  if (!editor) return null

  return <EditorContent editor={editor} />
}

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { post, loading } = usePostBySlug(slug!)

  if (loading) {
    return <LoadingSpinner />
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-4">🔍</span>
        <h1 className="text-2xl font-bold mb-2">文章不存在</h1>
        <p className="text-gray-500 mb-6">该文章可能已被删除或未发布</p>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700 underline"
        >
          返回首页
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        {post.cover_image && (
          <div className="aspect-video rounded-lg overflow-hidden mb-6 bg-gray-100">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
          {post.title}
        </h1>

        <time className="text-sm text-gray-400">
          {format(new Date(post.created_at), 'yyyy年MM月dd日')}
        </time>
      </header>

      {/* Content */}
      <div className="max-w-none">
        <PostContent content={post.content} />
      </div>

      {/* Footer nav */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          ← 返回首页
        </Link>
      </div>
    </article>
  )
}
