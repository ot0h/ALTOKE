import { logRequest, supabase } from './supabase'
import { UserProfile } from '../types'

type ProfileRow = {
  id: string
  name: string
  email: string
  avatar: string | null
  created_at: string
}

function toUserProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar ?? undefined,
  }
}

export type UpdateProfileInput = {
  name?: string
  email?: string
  avatar?: string
}

export const userProfileService = {
  async fetchProfile(userId: string): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    logRequest('fetchProfile', error, data)
    if (error) throw error
    return toUserProfile(data)
  },

  async updateProfile(
    userId: string,
    input: UpdateProfileInput,
  ): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...(input.name !== undefined && { name: input.name }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.avatar !== undefined && { avatar: input.avatar }),
      })
      .eq('id', userId)
      .select()
      .single()

    logRequest('updateProfile', error, data)
    if (error) throw error
    return toUserProfile(data)
  },

  async searchProfiles(term: string): Promise<UserProfile[]> {
    if (!term.trim()) return []

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`name.ilike.%${term.trim()}%,email.ilike.%${term.trim()}%`)
      .limit(20)

    logRequest('searchProfiles', error, data)
    if (error) throw error
    return (data ?? []).map(toUserProfile)
  },
}