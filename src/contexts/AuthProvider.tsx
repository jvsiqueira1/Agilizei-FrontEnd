import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { AuthContext, AuthContextType, UserRole } from './AuthContext'
import { jwtDecode } from 'jwt-decode'

interface Props {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userPhone, setUserPhone] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedToken: any = jwtDecode(token)
        const tipos = Array.isArray(decodedToken.tipos)
          ? decodedToken.tipos
          : []
        let role: UserRole | null = null
        const path = window.location.pathname
        if (path.includes('/parceiro') && tipos.includes('parceiro')) {
          role = 'partner'
        } else if (path.includes('/cliente') && tipos.includes('cliente')) {
          role = 'client'
        } else if (tipos.includes('admin')) {
          role = 'admin'
        } else if (tipos.includes('parceiro')) {
          role = 'partner'
        } else if (tipos.includes('cliente')) {
          role = 'client'
        } else {
          role = null
        }
        const id = decodedToken.id || null
        const nome = Cookies.get('nome') || decodedToken.nome || null
        const telefone = decodedToken.telefone || null
        setUserRole(role)
        setUserId(id)
        setUserName(nome)
        setUserPhone(telefone)
      } catch (error) {
        console.error('Token inválido: ', error)
        setUserRole(null)
        setUserId(null)
        setUserName(null)
        setUserPhone(null)
      }
    } else {
      setUserRole(null)
      setUserId(null)
      setUserName(null)
      setUserPhone(null)
    }
    setLoading(false)
  }, [])

  const login = (_role: UserRole, token: string) => {
    Cookies.set('token', token, {
      expires: 1,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decodedToken: any = jwtDecode(token)
    const role: UserRole = _role
    const id = decodedToken.id || null
    const nome = Cookies.get('nome') || decodedToken.nome || null
    const telefone = decodedToken.telefone || null
    setUserRole(role)
    setUserId(id)
    setUserName(nome)
    setUserPhone(telefone)
  }

  const logout = () => {
    Cookies.remove('token')
    setUserRole(null)
    setUserId(null)
    setUserName(null)
    setUserPhone(null)
  }

  const value: AuthContextType = {
    userRole,
    userId,
    userName,
    userPhone,
    isAuthenticated: !!userRole,
    login,
    logout,
  }

  if (loading) return null

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
