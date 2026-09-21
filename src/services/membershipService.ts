import { logRequest, supabase } from './supabase'
import { MemberShip, Role } from '../types'

type MembershipRow = {
  id: string
  user_id: string
  community_id: string
  role: Role
  created_at: string
}

export type CommunityMember = {
  userId: string
  communityId: string
  role: Role
  name: string
  email: string
  avatar: string
}

type ProfileRow = {
  id: string
  name: string | null
  email: string | null
  avatar: string | null
}

function toMemberShip(row: MembershipRow): MemberShip {
  return {
    userId: row.user_id,
    role: row.role,
    communityId: row.community_id,
  }
}

export const membershipService = {
  async fetchMemberships(userId: string): Promise<MemberShip[]> {
    const { data, error } = await supabase
      .from('memberships')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    logRequest('fetchMemberships', error, data)
    if (error) throw error
    return (data ?? []).map(toMemberShip)
  },

  async fetchCommunityMembers(communityId: string): Promise<CommunityMember[]> {
    const { data, error } = await supabase
      .from('memberships')
      .select('*')
      .eq('community_id', communityId)
      .order('created_at', { ascending: true })

    logRequest('fetchCommunityMembers', error, data)
    if (error) throw error

    const rows = (data ?? []) as MembershipRow[]
    const userIds = [...new Set(rows.map((row) => row.user_id))]

    if (userIds.length === 0) return []

    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, email, avatar')
      .in('id', userIds)

    logRequest('fetchCommunityMembers-profiles', profilesError, profilesData)
    if (profilesError) throw profilesError

    const profileMap = new Map(
      ((profilesData ?? []) as ProfileRow[]).map((profile) => [
        profile.id,
        profile,
      ]),
    )

    return rows.map((row) => {
      const profile = profileMap.get(row.user_id)

      return {
        userId: row.user_id,
        communityId: row.community_id,
        role: row.role,
        name: profile?.name || profile?.email || 'Vecino',
        email: profile?.email || '',
        avatar: profile?.avatar || '',
      }
    })
  },

  async joinCommunity(
    userId: string,
    communityId: string,
    role: Role = 'user',
  ): Promise<MemberShip> {
    const { data, error } = await supabase
      .from('memberships')
      .insert({
        user_id: userId,
        community_id: communityId,
        role,
      })
      .select()
      .single()

    logRequest('joinCommunity', error, data)
    if (error) throw error
    return toMemberShip(data)
  },

  async updateRole(
    userId: string,
    communityId: string,
    role: Role,
  ): Promise<MemberShip> {
    const { data, error } = await supabase
      .from('memberships')
      .update({ role })
      .eq('user_id', userId)
      .eq('community_id', communityId)
      .select()
      .single()

    logRequest('updateRole', error, data)
    if (error) throw error
    return toMemberShip(data)
  },

  async leaveCommunity(userId: string, communityId: string): Promise<void> {
    const { error } = await supabase
      .from('memberships')
      .delete()
      .eq('user_id', userId)
      .eq('community_id', communityId)

    logRequest('leaveCommunity', error)
    if (error) throw error
  },
}
