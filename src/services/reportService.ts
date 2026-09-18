import { logRequest, supabase } from './supabase'
import { loadProfilesByUserId } from './profileUtils'
import { Report, ReportNote, ReportStatus } from '../types'

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

type ReportNoteRow = {
  id: string
  report_id: string
  user_id: string
  content: string
  created_at: string
}

function toReportNote(row: ReportNoteRow): ReportNote {
  return {
    id: row.id,
    reportId: row.report_id,
    userId: row.user_id,
    content: row.content,
    createdAt: row.created_at,
  }
}

async function attachNoteAuthors(notes: ReportNote[]): Promise<void> {
  if (notes.length === 0) return

  const profilesByUser = await loadProfilesByUserId(
    notes.map((note) => note.userId),
  )

  for (const note of notes) {
    const profile = profilesByUser.get(note.userId)

    note.author = profile?.name || undefined
    note.authorAvatar = profile?.avatar || undefined
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
  async fetchReports(userId?: string, communityId?: string): Promise<Report[]> {
    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (communityId) {
      query = query.eq('community_id', communityId)
    }

    const { data, error } = await query
    logRequest('fetchReports', error, data)
    if (error) throw error

    return (data ?? []).map(toReport)
  },

  async fetchReportsByCommunities(communityIds: string[]): Promise<Report[]> {
    if (communityIds.length === 0) return []

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .in('community_id', communityIds)
      .order('created_at', { ascending: false })

    logRequest('fetchReportsByCommunities', error, data)
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

    const report = toReport(data)

    try {
      report.notes = await reportService.fetchReportNotes(id)
    } catch (notesError) {
      console.error('[fetchReport] No se pudieron cargar notas:', notesError)
    }

    return report
  },

  async fetchReportNotes(reportId: string): Promise<ReportNote[]> {
    const { data, error } = await supabase
      .from('report_notes')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: true })

    logRequest('fetchReportNotes', error, data)
    if (error) throw error

    const notes = ((data ?? []) as ReportNoteRow[]).map(toReportNote)
    await attachNoteAuthors(notes)
    return notes
  },

  async addReportNote(
    reportId: string,
    userId: string,
    content: string,
  ): Promise<ReportNote> {
    const { data, error } = await supabase
      .from('report_notes')
      .insert({
        report_id: reportId,
        user_id: userId,
        content,
      })
      .select()
      .single()

    logRequest('addReportNote', error, data)
    if (error) throw error

    const note = toReportNote(data as ReportNoteRow)
    await attachNoteAuthors([note])
    return note
  },

  async removeReportNote(noteId: string): Promise<void> {
    const { error } = await supabase
      .from('report_notes')
      .delete()
      .eq('id', noteId)

    logRequest('removeReportNote', error)
    if (error) throw error
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