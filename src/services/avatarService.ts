import { logRequest, supabase } from './supabase'
import { storageService } from './storageService'

export const avatarService = {
  async uploadAvatar(userId: string, uri: string): Promise<string> {
    const path = `${userId}/avatar.jpg`

    const url = await storageService.uploadImage('avatars', path, uri, {
      upsert: true,
      maxWidth: 512,
    })

    logRequest('uploadAvatar', null, { path })
    return url
  },
}