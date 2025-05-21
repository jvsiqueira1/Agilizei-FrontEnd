import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { Modal } from '@/components'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useMenu } from '@/contexts/useMenu'
import { ClientLogin, PartnerLogin } from '@/components'

export default function Header() {
  const [openClientModal, setClientModal] = useState(false)
  const [openPartnerModal, setPartnerModal] = useState(false)
  const { openMenu, toggleMenu, closeMenu } = useMenu()

  useEffect(() => {
    document.body.style.overflowX = 'hidden'
    return () => {
      document.body.style.overflowX = ''
    }
  }, [])

  return (
    <header className="w-full bg-light-gray border-b-2">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 relative flex items-center justify-between">
        {/* Logo à esquerda */}
        <NavLink to="/" className="flex items-center">
          <img
            className="w-28 sm:w-32 mt-4"
            src="agilizeiLogo.svg"
            alt="Agilizei Logo"
          />
        </NavLink>

        {/* NavLinks centralizados */}
        <ul className="hidden md:flex gap-10 absolute left-1/2 -translate-x-1/2 items-center">
          <li>
            <NavLink to="/sobre" className="hover:text-orange">
              Sobre
            </NavLink>
          </li>
          <li>
            <NavLink to="/servicos" className="hover:text-orange">
              Serviços
            </NavLink>
          </li>
          <li>
            <NavLink to="/FAQ" className="hover:text-orange">
              FAQ
            </NavLink>
          </li>
        </ul>

        {/* Botões à direita (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Button onClick={() => setClientModal(true)} variant="outline">
            Área do Cliente
          </Button>
          <Button onClick={() => setPartnerModal(true)} variant="outline">
            Área do Parceiro
          </Button>
        </div>

        {/* Menu mobile */}
        <div className="md:hidden flex items-center justify-center">
          <Button variant="ghost" onClick={toggleMenu}>
            {openMenu ? (
              <X className="text-3xl" />
            ) : (
              <Menu className="text-3xl" />
            )}
          </Button>
        </div>
      </div>

      {/* Menu lateral mobile */}
      <div
        className={`fixed top-0 left-0 h-screen w-[70%] max-w-sm bg-light-gray z-40 flex flex-col items-start p-6 transition-all duration-300 ease-in-out ${
          openMenu
            ? 'left-0 opacity-100 visible'
            : '-left-full opacity-0 invisible'
        }`}
      >
        <img
          className="w-28 sm:w-32 mb-6"
          src="agilizeiLogo.svg"
          alt="Agilizei Logo"
          onClick={closeMenu}
        />
        <ul className="flex flex-col gap-6">
          <li>
            <NavLink
              to="/sobre"
              className="hover:text-orange"
              onClick={closeMenu}
            >
              Sobre
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/servicos"
              className="hover:text-orange"
              onClick={closeMenu}
            >
              Serviços
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/FAQ"
              className="hover:text-orange"
              onClick={closeMenu}
            >
              FAQ
            </NavLink>
          </li>
          <li>
            <Button
              className="px-5"
              onClick={() => setClientModal(true)}
              variant="outline"
            >
              Área do Cliente
            </Button>
          </li>
          <li>
            <Button
              className="px-5"
              onClick={() => setPartnerModal(true)}
              variant="outline"
            >
              Área do Parceiro
            </Button>
          </li>
        </ul>
      </div>

      {/* Modais */}
      <Modal isVisible={openClientModal} onClose={() => setClientModal(false)}>
        <ClientLogin onClose={() => setClientModal(false)} />
      </Modal>

      <Modal
        isVisible={openPartnerModal}
        onClose={() => setPartnerModal(false)}
      >
        <PartnerLogin onClose={() => setPartnerModal(false)} />
      </Modal>
    </header>
  )
}
