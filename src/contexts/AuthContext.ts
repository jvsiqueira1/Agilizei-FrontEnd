import { createContext } from 'react'

export type UserRole = 'admin' | 'client' | 'partner'

export interface AuthContextType {
  userRole: UserRole | null
  isAuthenticated: boolean
  login: (role: UserRole, token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
