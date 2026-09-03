import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null

  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>

  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>

  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>

  signOut: () => Promise<void>
  initialize: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  initialize: async () => {
    set({ loading: true })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    set({
      session,
      user: session?.user ?? null,
      loading: false,
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
        loading: false,
      })
    })
  },

  signUp: async (
    name: string,
    email: string,
    password: string
  ) => {
    set({
      loading: true,
      error: null,
    })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      set({
        loading: false,
        error: error.message,
      })

      return {
        success: false,
        error: error.message,
      }
    }

    set({
      user: data.user,
      session: data.session,
      loading: false,
    })

    return {
      success: true,
    }
  },

  signIn: async (
    email: string,
    password: string
  ) => {
    set({
      loading: true,
      error: null,
    })

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (error) {
      set({
        loading: false,
        error: error.message,
      })

      return {
        success: false,
        error: error.message,
      }
    }

    set({
      user: data.user,
      session: data.session,
      loading: false,
    })

    return {
      success: true,
    }
  },

  // Forgot Password
  resetPassword: async (email: string) => {
    set({
      loading: true,
      error: null,
    })

    const { error } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

    if (error) {
      set({
        loading: false,
        error: error.message,
      })

      return {
        success: false,
        error: error.message,
      }
    }

    set({
      loading: false,
    })

    return {
      success: true,
    }
  },

  signOut: async () => {
    set({
      loading: true,
    })

    await supabase.auth.signOut()

    set({
      user: null,
      session: null,
      loading: false,
    })
  },

  clearError: () => set({
    error: null,
  }),
}))

