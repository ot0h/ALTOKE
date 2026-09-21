import { logRequest, supabase } from './supabase'
import { Category, CategoryType } from '../types'

type CategoryRow = {
  id: string
  community_id: string
  name: string
  type: CategoryType
}

function toCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    communityId: row.community_id,
    name: row.name,
    type: row.type,
  }
}

export type CreateCategoryInput = {
  name: string
  communityId: string
  type: CategoryType
}

export const categoryService = {
  async fetchCategories(
    communityId?: string,
    type?: CategoryType,
  ): Promise<Category[]> {
    let query = supabase.from('categories').select('*')

    if (communityId) {
      query = query.eq('community_id', communityId)
    }
    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query
    logRequest('fetchCategories', error, data)
    if (error) throw error

    return (data ?? []).map(toCategory)
  },

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: input.name,
        community_id: input.communityId,
        type: input.type,
      })
      .select()
      .single()

    logRequest('createCategory', error, data)
    if (error) throw error
    return toCategory(data)
  },

  async updateCategory(
    id: string,
    input: Partial<CreateCategoryInput>,
  ): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update({
        ...(input.name !== undefined && { name: input.name }),
        ...(input.communityId !== undefined && {
          community_id: input.communityId,
        }),
        ...(input.type !== undefined && { type: input.type }),
      })
      .eq('id', id)
      .select()
      .single()

    logRequest('updateCategory', error, data)
    if (error) throw error
    return toCategory(data)
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    logRequest('deleteCategory', error)
    if (error) throw error
  },
}
