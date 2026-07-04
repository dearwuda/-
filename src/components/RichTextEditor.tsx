import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block'
import { VideoExtension } from './VideoExtension'
import ImageUploader from './ImageUploader'
import VideoUploader from './VideoUploader'
import { useCallback } from 'react'

interface RichTextEditorProps {
  content: Record<string, unknown> | string
  onChange: (content: Record<string, unknown>) => void
  placeholder?: string
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = '开始写作...',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        HTMLAttributes: {
          class: 'bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm',
        },
      }),
      VideoExtension,
    ],
    content: typeof content === 'string' ? content : content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON() as unknown as Record<string, unknown>)
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-3',
      },
    },
  })

  const addImage = useCallback(
    (url: string) => {
      if (!editor) return
      editor.chain().focus().setImage({ src: url, alt: '' }).run()
    },
    [editor]
  )

  const addVideo = useCallback(
    (url: string) => {
      if (!editor) return
      editor.chain().focus().setVideo({ src: url }).run()
    },
    [editor]
  )

  if (!editor) {
    return (
      <div className="border rounded-lg p-4 text-center text-gray-400">
        编辑器加载中...
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          label="H1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          label="H2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          label="H3"
        />

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          label="B"
          className="font-bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          label="I"
          className="italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          label="&lt;/&gt;"
        />

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          label="•"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          label="1."
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          label="❝"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          label="{}"
        />

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => {
            const url = window.prompt('输入链接 URL：')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          active={editor.isActive('link')}
          label="🔗"
        />

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ImageUploader onUpload={addImage} buttonText="🖼" />
        <VideoUploader onUpload={addVideo} buttonText="🎬" />
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} className="min-h-[300px]" />
    </div>
  )
}

function ToolbarButton({
  onClick,
  active,
  label,
  className = '',
}: {
  onClick: () => void
  active: boolean
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center text-sm rounded transition-colors cursor-pointer ${
        active
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-200'
      } ${className}`}
    >
      {label}
    </button>
  )
}
