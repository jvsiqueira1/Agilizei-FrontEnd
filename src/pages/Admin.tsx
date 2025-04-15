import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { AdminSidebar, Modal, AdminLogin } from '@/components'
import { useAuth } from '@/contexts/useAuth'

export default function Admin() {
  const { userRole } = useAuth()
  const [showAdminModal, setShowAdminModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!userRole || userRole !== 'admin') {
      setShowAdminModal(true)
    }
  }, [userRole])

  const handleLoginSuccess = () => {
    setShowAdminModal(false)
    navigate('/admin/funcionarios')
    alert('Login como ADMIN feito com sucesso!')
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>

      <Modal isVisible={showAdminModal} onClose={() => {}}>
        <AdminLogin onClose={handleLoginSuccess} />
      </Modal>
    </div>
  )
}
