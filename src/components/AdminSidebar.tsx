import { NavLink } from 'react-router'
import { Button } from '@/components/ui/button'

const AdminSidebar = () => {
  return (
    <aside className="h-screen w-64 bg-muted p-6 flex flex-col gap-4 shadow-md">
      <h2 className="text-lg font-bold">Agilizei Admin</h2>

      <NavLink
        to="/admin/funcionarios"
        className={({ isActive }) =>
          isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
        }
      >
        <Button variant="ghost" className="w-full justify-start">
          Funcionários
        </Button>
      </NavLink>

      <NavLink
        to="/admin/clientes"
        className={({ isActive }) =>
          isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
        }
      >
        <Button variant="ghost" className="w-full justify-start">
          Clientes
        </Button>
      </NavLink>

      <NavLink
        to="/admin/servicos"
        className={({ isActive }) =>
          isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
        }
      >
        <Button variant="ghost" className="w-full justify-start">
          Serviços
        </Button>
      </NavLink>
    </aside>
  )
}

export default AdminSidebar
