import { logRequest, supabase } from './supabase'
import { Community } from '../types'

type CommunityRow = {
  id: string
  owner_id: string
  name: string
  description: string
  address: string
  image: string | null
  rules: string | null
  code: string
  created_at: string
}

function toCommunity(row: CommunityRow): Community {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    description: row.description,
    address: row.address,
    image: row.image ?? '',
    rules: row.rules ?? '',
    code: row.code,
    createdAt: row.created_at,
  }
}

const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function generateJoinCode(length = 6): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  }
  return result
}

export type CreateCommunityInput = Omit<
  Community,
  'id' | 'createdAt' | 'code'
>
export type UpdateCommunityInput = Partial<CreateCommunityInput>

export const communityService = {
  async fetchCommunities(userId?: string): Promise<Community[]> {
    let query = supabase
      .from('communities')
      .select('*')
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.eq('owner_id', userId)
    }

    const { data, error } = await query
    logRequest('fetchCommunities', error, data)
    if (error) throw error

    return (data ?? []).map(toCommunity)
  },

  async fetchCommunity(id: string): Promise<Community | null> {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    logRequest('fetchCommunity', error, data)
    if (error) throw error
    return data ? toCommunity(data) : null
  },

  async createCommunity(input: CreateCommunityInput): Promise<Community> {
    let lastError: unknown = null

    for (let attempt = 0; attempt < 3; attempt++) {
      const code = generateJoinCode()

      const { data, error } = await supabase
        .from('communities')
        .insert({
          owner_id: input.ownerId,
          name: input.name,
          description: input.description,
          address: input.address,
          image: input.image || null,
          rules: input.rules || null,
          code,
        })
        .select()
        .single()

      if (!error) {
        logRequest('createCommunity', error, data)
        return toCommunity(data)
      }

      logRequest('createCommunity', error, data)
      lastError = error

      if (error.code !== '23505') {
        throw error
      }
    }

    throw lastError
  },

  async updateCommunity(
    id: string,
    input: UpdateCommunityInput,
  ): Promise<Community> {
    const { data, error } = await supabase
      .from('communities')
      .update({
        ...(input.ownerId !== undefined && { owner_id: input.ownerId }),
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.address !== undefined && { address: input.address }),
        ...(input.image !== undefined && { image: input.image }),
        ...(input.rules !== undefined && { rules: input.rules }),
      })
      .eq('id', id)
      .select()
      .single()

    logRequest('updateCommunity', error, data)
    if (error) throw error
    return toCommunity(data)
  },

  async deleteCommunity(id: string): Promise<void> {
    const { error } = await supabase.from('communities').delete().eq('id', id)
    logRequest('deleteCommunity', error)
    if (error) throw error
  },
}