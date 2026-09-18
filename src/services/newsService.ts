import { logRequest, supabase } from './supabase'
import { News, NewsCategory, NewsStatus } from '../store/slices/newsSlice'

type NewsRow = {
  id: string
  user_id: string
  community_id: string
  title: string
  content: string
  image: string | null
  category: NewsCategory
  status: NewsStatus
  created_at: string
}

function toNews(row: NewsRow): News {
  return {
    id: row.id,
    userId: row.user_id,
    communityId: row.community_id,
    title: row.title,
    content: row.content,
    image: row.image ?? undefined,
    category: row.category,
    status: row.status,
    createdAt: row.created_at,
  }
}

export type CreateNewsInput = {
  title: string
  content: string
  userId: string
  communityId: string
  image?: string
  category: NewsCategory
  status: NewsStatus
}

export const newsService = {
  async fetchNews(communityIds?: string[]): Promise<News[]> {
    let query = supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })

    if (communityIds && communityIds.length > 0) {
      query = query.in('community_id', communityIds)
    }

    const { data, error } = await query
    logRequest('fetchNews', error, data)
    if (error) throw error

    return (data ?? []).map(toNews)
  },

  async fetchNewsByCommunity(communityId: string): Promise<News[]> {
    return newsService.fetchNews([communityId])
  },

  async createNews(input: CreateNewsInput): Promise<News> {
    const { data, error } = await supabase
      .from('news')
      .insert({
        title: input.title,
        content: input.content,
        user_id: input.userId,
        community_id: input.communityId,
        image: input.image ?? null,
        category: input.category,
        status: input.status,
      })
      .select()
      .single()

    logRequest('createNews', error, data)
    if (error) throw error
    return toNews(data)
  },

  async deleteNews(id: string): Promise<void> {
    const { error } = await supabase.from('news').delete().eq('id', id)
    logRequest('deleteNews', error)
    if (error) throw error
  },

  async updateNewsStatus(
    id: string,
    status: NewsStatus,
  ): Promise<News> {
    const { data, error } = await supabase
      .from('news')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    logRequest('updateNewsStatus', error, data)
    if (error) throw error
    return toNews(data)
  },
}