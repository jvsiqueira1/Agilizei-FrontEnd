import { NavLink } from 'react-router'
import { Button } from '@/components/ui/button'
import Cookies from 'js-cookie'

const handleLogout = () => {
  Cookies.remove('token')
}

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {

  return (
    <aside className={`
        fixed md:static top-0 left-0 h-screen w-64 bg-muted p-6 z-50 transition-transform space-y-4
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        <button
        onClick={onClose}
        className="md:hidden mb-4 text-right w-full text-sm text-muted-foreground"
      >
        Fechar ✕
      </button>
      <h2 className="text-lg font-bold">Agilizei Admin</h2>

      <nav className="flex flex-col gap-2">
        {[
          { to: '/admin/parceiros', label: 'Parceiros' },
          { to: '/admin/clientes', label: 'Clientes' },
          { to: '/admin/servicos', label: 'Serviços' },
          { to: '/admin/tipos', label: 'Tipos de Serviços' },
          { to: '/admin/criar-admin', label: 'Criar novo admin' },
          { to: '/admin/outros-servicos', label: 'Outros Serviços' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
            }
          >
            <Button variant="ghost" className="w-full justify-start">
              {label}
            </Button>
          </NavLink>
        ))}

        <NavLink
          onClick={handleLogout}
          to="/"
          className="text-muted-foreground"
        >
          <Button variant="ghost" className="w-full justify-start">
            Sair
          </Button>
        </NavLink>
      </nav>
    </aside>
  )
}

export default AdminSidebar
