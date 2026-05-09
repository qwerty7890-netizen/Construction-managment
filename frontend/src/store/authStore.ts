import { create } from 'zustand'

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  phone: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => {
    localStorage.clear()
    set({ user: null, isAuthenticated: false })
  },
}))
