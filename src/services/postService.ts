import { logRequest, supabase } from './supabase'
import { Comment, Post } from '../types'

type PostRow = {
  id: string
  user_id: string
  community_id: string
  title: string
  content: string
  image: string | null
  category: Post['category'] | null
  created_at: string
  likes: { count: number }[]
}

type CommentRow = {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
}

function toPost(row: PostRow): Post {
  return {
    id: row.id,
    userId: row.user_id,
    communityId: row.community_id,
    title: row.title,
    content: row.content,
    image: row.image ?? undefined,
    category: row.category ?? undefined,
    likes: row.likes?.[0]?.count ?? 0,
    comments: [],
    createdAt: row.created_at,
  }
}

function toComment(row: CommentRow): Comment {
  return {
    id: row.id,
    userId: row.user_id,
    content: row.content,
    createdAt: row.created_at,
  }
}

export type CreatePostInput = {
  title: string
  content: string
  userId: string
  communityId: string
  image?: string
  category?: Post['category']
}

export const postService = {
  async fetchPosts(
    communityId?: string,
    forumOnly = true,
  ): Promise<Post[]> {
    let query = supabase
      .from('posts')
      .select('*, likes:post_likes(count)')
      .order('created_at', { ascending: false })

    if (communityId) {
      query = query.eq('community_id', communityId)
    }

    if (forumOnly) {
      query = query.is('category', null)
    }

    const { data, error } = await query
    logRequest('fetchPosts', error, data)
    if (error) throw error

    return (data ?? []).map(toPost)
  },

  async fetchPost(id: string): Promise<Post> {
    const [postResult, commentsResult] = await Promise.all([
      supabase
        .from('posts')
        .select('*, likes:post_likes(count)')
        .eq('id', id)
        .single(),
      supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true }),
    ])

    if (postResult.error) throw postResult.error
    if (commentsResult.error) throw commentsResult.error

    logRequest('fetchPost(post)', postResult.error, postResult.data)
    logRequest('fetchPost(comments)', commentsResult.error, commentsResult.data)

    return {
      ...toPost(postResult.data),
      comments: (commentsResult.data ?? []).map(toComment),
    }
  },

  async createPost(input: CreatePostInput): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title: input.title,
        content: input.content,
        user_id: input.userId,
        community_id: input.communityId,
        image: input.image ?? null,
        category: input.category ?? null,
      })
      .select()
      .single()

    logRequest('createPost', error, data)
    if (error) throw error
    return toPost({ ...data, likes: [] })
  },

  async deletePost(id: string): Promise<void> {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    logRequest('deletePost', error)
    if (error) throw error
  },

  async likePost(postId: string, userId: string): Promise<void> {
    const { error } = await supabase.from('post_likes').upsert(
      { post_id: postId, user_id: userId },
      { onConflict: 'post_id,user_id' },
    )
    logRequest('likePost', error, { postId, userId })
    if (error) throw error
  },

  async unlikePost(postId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
    logRequest('unlikePost', error, { postId, userId })
    if (error) throw error
  },

  async fetchComments(postId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    logRequest('fetchComments', error, data)
    if (error) throw error
    return (data ?? []).map(toComment)
  },

  async addComment(
    postId: string,
    userId: string,
    content: string,
  ): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: userId, content })
      .select()
      .single()

    logRequest('addComment', error, data)
    if (error) throw error
    return toComment(data)
  },

  async removeComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
    logRequest('removeComment', error)
    if (error) throw error
  },
}