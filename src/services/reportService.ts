import { logRequest, supabase } from './supabase'
import { Report, ReportStatus } from '../types'

type ReportRow = {
  id: string
  title: string
  description: string
  category: string
  location: string | null
  status: ReportStatus
  user_id: string
  community_id: string
  fotos: string[] | null
  created_at: string
}

function toReport(row: ReportRow): Report {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location ?? '',
    status: row.status,
    userId: row.user_id,
    communityId: row.community_id,
    fotos: row.fotos ?? [],
    createdAt: row.created_at,
  }
}

export type CreateReportInput = {
  title: string
  description: string
  category: string
  location: string
  userId: string
  communityId: string
  fotos?: string[]
}

export const reportService = {
  async fetchReports(communityId?: string): Promise<Report[]> {
    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })

    if (communityId) {
      query = query.eq('community_id', communityId)
    }

    const { data, error } = await query
    logRequest('fetchReports', error, data)
    if (error) throw error

    return (data ?? []).map(toReport)
  },

  async fetchReport(id: string): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single()

    logRequest('fetchReport', error, data)
    if (error) throw error
    return toReport(data)
  },

  async createReport(input: CreateReportInput): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        title: input.title,
        description: input.description,
        category: input.category,
        location: input.location,
        status: 'revision',
        user_id: input.userId,
        community_id: input.communityId,
        fotos: input.fotos ?? [],
      })
      .select()
      .single()

    logRequest('createReport', error, data)
    if (error) throw error
    return toReport(data)
  },

  async updateReportStatus(
    id: string,
    status: ReportStatus,
  ): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    logRequest('updateReportStatus', error, data)
    if (error) throw error
    return toReport(data)
  },

  async deleteReport(id: string): Promise<void> {
    const { error } = await supabase.from('reports').delete().eq('id', id)
    logRequest('deleteReport', error)
    if (error) throw error
  },
}