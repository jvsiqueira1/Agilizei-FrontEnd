import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { AuthContext, AuthContextType, UserRole } from './AuthContext'
import { jwtDecode } from 'jwt-decode'

interface Props {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  const [userRole, setUserRole] = useState<UserRole | null>(null)

  useEffect(() => {
    const token = Cookies.get('token')

    if (token) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedToken: any = jwtDecode(token)
        console.log(decodedToken)
        const role = decodedToken.role
        setUserRole(role)
      } catch (error) {
        console.error('Token inválido: ', error)
        setUserRole(null)
      }
    }
  }, [])

  const login = (role: UserRole, token: string) => {
    Cookies.set('token', token, {
      expires: 1,
    })
    setUserRole(role)
  }

  const logout = () => {
    Cookies.remove('token')
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
