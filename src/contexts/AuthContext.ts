import { createContext } from 'react'

export type UserRole = 'admin' | 'client' | 'partner' | null

export interface AuthContextType {
  userRole: UserRole
  isAuthenticated: boolean
  login: (role: UserRole) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
