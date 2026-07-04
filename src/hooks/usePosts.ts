import { useState, useEffect, useCallback } from 'react'
import type { Post } from '../types'
import {
  fetchPublishedPosts,
  fetchAllPosts,
  fetchPostBySlug,
  fetchPostById,
  createPost,
  updatePost,
  deletePost,
} from '../lib/supabase'

export function usePublishedPosts(page = 1) {
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchPublishedPosts(page).then(({ data, count }) => {
      setPosts(data ?? [])
      setTotal(count ?? 0)
      setLoading(false)
    })
  }, [page])

  return { posts, total, loading }
}

export function useAllPosts(page = 1) {
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  useEffect(() => {
    setLoading(true)
    fetchAllPosts(page).then(({ data, count }) => {
      setPosts(data ?? [])
      setTotal(count ?? 0)
      setLoading(false)
    })
  }, [page, refreshKey])

  return { posts, total, loading, refresh }
}

export function usePostBySlug(slug: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchPostBySlug(slug).then(({ data }) => {
      setPost(data)
      setLoading(false)
    })
  }, [slug])

  return { post, loading }
}

export function usePostById(id: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setPost(null)
      setLoading(false)
      return
    }
    setLoading(true)
    fetchPostById(id).then(({ data }) => {
      setPost(data)
      setLoading(false)
    })
  }, [id])

  return { post, loading }
}

export function usePostMutations() {
  const create = useCallback(async (post: Parameters<typeof createPost>[0]) => {
    return await createPost(post)
  }, [])

  const update = useCallback(
    async (id: string, post: Parameters<typeof updatePost>[1]) => {
      return await updatePost(id, post)
    },
    []
  )

  const remove = useCallback(async (id: string) => {
    return await deletePost(id)
  }, [])

  return { createPost: create, updatePost: update, deletePost: remove }
}
