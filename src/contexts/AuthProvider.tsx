import { useState } from 'react'
import { AuthContext, AuthContextType, UserRole } from './AuthContext'

interface Props {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  const [userRole, setUserRole] = useState<UserRole>(null)

  const login = (role: UserRole) => {
    setUserRole(role)
  }

  const logout = () => {
    setUserRole(null)
  }

  const value: AuthContextType = {
    userRole,
    isAuthenticated: !!userRole,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
