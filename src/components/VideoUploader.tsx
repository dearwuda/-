import { useRef, useState } from 'react'
import { uploadFile } from '../lib/supabase'

interface VideoUploaderProps {
  onUpload: (url: string) => void
  buttonText?: string
}

export default function VideoUploader({ onUpload, buttonText = '上传视频' }: VideoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      alert('请选择视频文件')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('视频大小不能超过 50MB')
      return
    }

    setUploading(true)
    const { url, error } = await uploadFile('videos', file)
    setUploading(false)

    if (error) {
      alert('上传失败：' + error.message)
      return
    }

    if (url) {
      onUpload(url)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
      >
        {uploading ? '上传中...' : buttonText}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  )
}
