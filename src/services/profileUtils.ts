import { logRequest, supabase } from './supabase'

export type ProfileLite = {
  name?: string
  avatar?: string
}

export async function loadProfilesByUserId(
  userIds: string[],
): Promise<Map<string, ProfileLite>> {
  const uniqueIds = [...new Set(userIds)]

  if (uniqueIds.length === 0) return new Map()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, avatar')
    .in('id', uniqueIds)

  logRequest('profiles lookup', error, data)
  if (error) return new Map()

  return new Map(
    ((data ?? []) as { id: string; name: string; avatar?: string | null }[]).map(
      (profile) => [
        profile.id,
        {
          name: profile.name,
          avatar: profile.avatar ?? undefined,
        },
      ],
    ),
  )
}