import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan las credenciales de Supabase. Revisa tu archivo .env: EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export function logRequest(
  label: string,
  error: { message: string } | null,
  data?: unknown,
) {
  if (error) {
    console.error(`[Supabase ✗] ${label} ->`, error.message)
    return
  }
  const summary = Array.isArray(data) ? ` (${data.length} results)` : ''
  console.log(`[Supabase ✓] ${label}${summary}`, data)
}