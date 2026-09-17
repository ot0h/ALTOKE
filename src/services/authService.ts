import { logRequest, supabase } from './supabase'

export type SignUpInput = {
  email: string
  password: string
  name: string
}

export const authService = {
  async signUp({ email, password, name }: SignUpInput) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    logRequest('auth.signUp', error, data.user)
    if (error) throw error
    return data.user
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    logRequest('auth.signIn', error, data.user)
    if (error) throw error
    return data.user
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    logRequest('auth.signOut', error)
    if (error) throw error
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    logRequest('auth.getSession', error, data.session?.user)
    if (error) throw error
    return data.session
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser()
    logRequest('auth.getUser', error, data.user)
    if (error) throw error
    return data.user
  },
}