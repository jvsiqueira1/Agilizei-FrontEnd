import { Navigate } from 'react-router'
import { useAuth } from './useAuth'
import { useEffect, useState } from 'react'
import { AdminLogin, Modal } from '@/components'

interface Props {
  children: React.ReactNode
  allowedRoles: ('admin' | 'client' | 'partner')[]
}

export function PrivateRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, userRole } = useAuth()
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  const isAdminRoute = allowedRoles.includes('admin')

  useEffect(() => {
    if (!isAuthenticated && isAdminRoute) {
      setShowAdminLogin(true)
    }
  }, [isAuthenticated, isAdminRoute])

  if (!isAuthenticated && isAdminRoute) {
    return (
      <Modal
        isVisible={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
      >
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      </Modal>
    )
  }

  if (!isAuthenticated || !allowedRoles.includes(userRole!)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
