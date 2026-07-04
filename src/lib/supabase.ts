import { createClient } from '@supabase/supabase-js'
import type { Post } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '请在 .env 文件中配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ===== Auth =====

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { session: data.session, error }
}

// ===== Posts =====

export async function fetchPublishedPosts(page = 1, limit = 10) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  return { data: data as Post[] | null, error, count }
}

export async function fetchAllPosts(page = 1, limit = 20) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  return { data: data as Post[] | null, error, count }
}

export async function fetchPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  return { data: data as Post | null, error }
}

export async function fetchPostById(id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  return { data: data as Post | null, error }
}

export async function createPost(post: {
  title: string
  slug: string
  content: Record<string, unknown>
  excerpt: string
  cover_image: string | null
  tags: string[]
  published: boolean
}) {
  const { data, error } = await supabase
    .from('posts')
    .insert([post])
    .select()
    .single()

  return { data: data as Post | null, error }
}

export async function updatePost(
  id: string,
  post: {
    title: string
    slug: string
    content: Record<string, unknown>
    excerpt: string
    cover_image: string | null
    tags: string[]
    published: boolean
  }
) {
  const { data, error } = await supabase
    .from('posts')
    .update({ ...post, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  return { data: data as Post | null, error }
}

export async function deletePost(id: string) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  return { error }
}

// ===== Storage =====

export async function uploadFile(
  bucket: 'images' | 'videos',
  file: File
) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) return { url: null, error }

  const publicUrl = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName).data.publicUrl

  return { url: publicUrl, error: null }
}

export async function deleteFile(bucket: 'images' | 'videos', url: string) {
  const path = url.split('/').pop()
  if (!path) return { error: new Error('无效的文件路径') }
  const { error } = await supabase.storage.from(bucket).remove([path])
  return { error }
}
