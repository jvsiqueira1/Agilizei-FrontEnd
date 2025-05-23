import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

interface HeaderProps {
  nome: string
  isCliente: boolean
  onNovoServico?: () => void
  onLogout: () => void
}

export function LoginHeader({
  nome,
  isCliente,
  onNovoServico,
  onLogout,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="w-full bg-light-gray border-2">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between md:justify-center relative flex-wrap md:flex-nowrap">
        {/* Texto */}
        <h1 className="flex-grow md:text-xl font-semibold text-black whitespace-nowrap order-2 md:order-1">
          Bem vindo(a) {nome} ao portal Agilizei
        </h1>

        {/* Espaço para balancear no desktop */}
        <div className="hidden md:block md:w-32 order-1" />

        {/* Botões desktop */}
        <div className="hidden md:flex items-center gap-4 order-3">
          {isCliente && onNovoServico && (
            <Button onClick={onNovoServico}>Novo Serviço</Button>
          )}
          <Button
            onClick={onLogout}
            variant="destructive"
            className="flex items-center gap-1"
          >
            <ArrowLeft size={16} /> Sair
          </Button>
        </div>

        {/* Botão menu mobile */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200 order-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menu dropdown mobile */}
        {menuOpen && (
          <div className="absolute top-full mt-1 w-48 bg-light-gray border rounded shadow flex flex-col z-50 md:hidden">
            {isCliente && onNovoServico && (
              <button
                onClick={() => {
                  onNovoServico()
                  setMenuOpen(false)
                }}
                className="px-4 py-2 hover:bg-gray-100 text-left"
              >
                Novo Serviço
              </button>
            )}
            <button
              onClick={() => {
                onLogout()
                setMenuOpen(false)
              }}
              className="px-4 py-2 hover:bg-gray-100 text-left text-red-600"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
