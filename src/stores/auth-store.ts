import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthUser {
  accountNo: string
  email: string
  name?: string
  role: string[]
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string | null
    setAccessToken: (accessToken: string | null) => void
    isInitialized: boolean
    reset: () => Promise<void>
  }
}

function mapSupabaseUser(user: User): AuthUser {
  return {
    accountNo: user.id,
    email: user.email || '',
    name: user.user_metadata?.name,
    role: user.app_metadata?.role || ['user'],
    exp: user.app_metadata?.exp || 0,
  }
}

export const useAuthStore = create<AuthState>()((set) => ({
  auth: {
    user: null,
    accessToken: null,
    isInitialized: false,
    setUser: (user) =>
      set((state) => ({ ...state, auth: { ...state.auth, user } })),
    setAccessToken: (accessToken) =>
      set((state) => ({ ...state, auth: { ...state.auth, accessToken } })),
    reset: async () => {
      // Clear state first to avoid race conditions
      set((state) => ({
        ...state,
        auth: {
          ...state.auth,
          user: null,
          accessToken: null,
          isInitialized: true,
        },
      }))
      try {
        await supabase.auth.signOut()
      } catch {
        // Ignore signOut errors — state is already cleared
      }
    },
  },
}))

// --- Module-level initialization (runs exactly once) ---

// 1. Set up the auth state change listener (handles login, logout, token refresh)
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    const user = mapSupabaseUser(session.user)
    useAuthStore.setState((state) => ({
      ...state,
      auth: {
        ...state.auth,
        user,
        accessToken: session.access_token,
        isInitialized: true,
      },
    }))
  } else {
    useAuthStore.setState((state) => ({
      ...state,
      auth: {
        ...state.auth,
        user: null,
        accessToken: null,
        isInitialized: true,
      },
    }))
  }
})

// 2. Check for an existing session on load
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    const user = mapSupabaseUser(session.user)
    useAuthStore.setState((state) => ({
      ...state,
      auth: {
        ...state.auth,
        user,
        accessToken: session.access_token,
        isInitialized: true,
      },
    }))
  } else {
    useAuthStore.setState((state) => ({
      ...state,
      auth: { ...state.auth, isInitialized: true },
    }))
  }
}).catch(() => {
  useAuthStore.setState((state) => ({
    ...state,
    auth: { ...state.auth, isInitialized: true },
  }))
})

