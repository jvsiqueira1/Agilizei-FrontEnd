import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { Modal } from '@/components'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useMenu } from '@/contexts/useMenu'

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
    <header className="w-screen bg-light-gray flex justify-between p-8 z-50 border-b-2">
      <nav className="relative flex justify-between items-center w-[92%] mx-auto">
        <div>
          <NavLink to="/">
            <img className="w-32" src="agilizeiLogo.svg" alt="Agilizei Logo" />
          </NavLink>
        </div>
        <div className="hidden md:flex absolute left-[50%] -translate-x-[54%]">
          <ul className="flex flex-row items-center gap-[4vw]">
            <li>
              <NavLink to="/about" className="hover:text-orange">
                Sobre
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className="hover:text-orange">
                Serviços
              </NavLink>
            </li>
            <li>
              <NavLink to="/FAQ" className="hover:text-orange">
                FAQ
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex gap-4">
          <Button onClick={() => setClientModal(true)} variant={'outline'}>
            Área do Cliente
          </Button>
          <Button onClick={() => setPartnerModal(true)} variant={'outline'}>
            Área do Parceiro
          </Button>
        </div>
        <div className="md:hidden flex items-center gap-4">
          <Button variant="ghost" onClick={toggleMenu}>
            {openMenu ? (
              <X className="text-3xl" />
            ) : (
              <Menu className="text-3xl" />
            )}
          </Button>
        </div>
        <div
          className={`fixed top-0 left-0 h-screen w-[70%] max-w-sm bg-light-gray z-40 flex flex-col items-start p-6 transition-all duration-300 ease-in-out ${
            openMenu
              ? 'left-0 opacity-100 visible'
              : '-left-full opacity-0 invisible'
          }`}
        >
          <img
            className="w-32 mb-6"
            src="agilizeiLogo.svg"
            alt="Agilizei Logo"
            onClick={closeMenu}
          />
          <ul className="flex flex-col gap-6">
            <li>
              <NavLink
                to="/about"
                className="hover:text-orange"
                onClick={closeMenu}
              >
                Sobre
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
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
      </nav>
      <Modal isVisible={openClientModal} onClose={() => setClientModal(false)}>
        <div className="flex flex-col justify-center items-center gap-6 overflow-hidden">
          <img src="agilizeiLogo.svg" alt="Agilizei Logo" />
          <div className="flex flex-col gap-2">
            <label>Digite seu nome</label>
            <Input type="text" placeholder="Nome" required />
          </div>
          <div className="flex flex-col gap-2">
            <label>Digite seu telefone</label>
            <Input type="tel" placeholder="Telefone" required />
          </div>
          <Button type="submit" className="w-48">
            Entrar
          </Button>
        </div>
      </Modal>

      <Modal
        isVisible={openPartnerModal}
        onClose={() => setPartnerModal(false)}
      >
        <div className="flex flex-col justify-center items-center gap-6">
          <img src="agilizeiLogo.svg" alt="Agilizei Logo" />
          <div className="flex flex-col gap-2">
            <label>Digite seu nome</label>
            <Input type="text" placeholder="Nome" required />
          </div>
          <div className="flex flex-col gap-2">
            <label>Digite seu telefone</label>
            <Input type="tel" placeholder="Telefone" required />
          </div>
          <Button type="submit" className="w-48">
            Entrar
          </Button>
        </div>
      </Modal>
    </header>
  )
}
