import * as FileSystem from 'expo-file-system/legacy'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import { logRequest, supabase } from './supabase'

type UploadImageOptions = {
  upsert?: boolean
  maxWidth?: number
  cacheControl?: string
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

export function makeImagePath(folder: string): string {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  return `${folder}/img-${stamp}.jpg`
}

export const storageService = {
  async uploadImage(
    bucket: string,
    path: string,
    uri: string,
    options: UploadImageOptions = {},
  ): Promise<string> {
    const { upsert = false, maxWidth = 1280, cacheControl = '3600' } = options

    // Redimensiona y comprime antes de subir: archivos ligeros y subida rápida.
    const resized = await manipulateAsync(
      uri,
      [{ resize: { width: maxWidth } }],
      { compress: 0.8, format: SaveFormat.JPEG },
    )

    const base64 = await FileSystem.readAsStringAsync(resized.uri, {
      encoding: FileSystem.EncodingType.Base64,
    })

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, base64ToUint8Array(base64), {
        contentType: 'image/jpeg',
        cacheControl,
        upsert,
      })

    logRequest(`storage.uploadImage(${bucket})`, error, { path })
    if (error) throw error

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)

    // ?v= fuerza a las <Image> (RN cachea por URL) a re-descargar el archivo.
    return `${data.publicUrl}?v=${Date.now()}`
  },
}
