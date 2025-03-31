import { useState } from 'react'
import { NavLink } from 'react-router'
import { Modal } from '@/components'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export default function Header() {
  const [openClientModal, setClientModal] = useState(false)
  const [openPartnerModal, setPartnerModal] = useState(false)

  const navLinks = document.querySelector('.nav-links')
  function onToggleMenu() {
    navLinks?.classList.toggle('top-[9%]')
  }

  return (
    <header className="w-screen bg-light-gray flex justify-between p-8">
      <nav className="flex justify-between items-center w-[92%] mx-auto">
        <div>
          <NavLink to="/">
            <img
              className="w-32 mt-4 lg:hidden md:hidden"
              src="agilizeiLogo.svg"
              alt="Agilizei Logo"
            />
          </NavLink>
        </div>
        <div className="nav-links md:static absolute bg-light-gray md:min-h-fit min-h-[40vh] left-0 top-[-100%] md:w-auto w-full flex items-center px-5">
          <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 mt-6">
            <li>
              <NavLink to="/">
                <img
                  className="w-32 mt-4 max-md:hidden"
                  src="agilizeiLogo.svg"
                  alt="Agilizei Logo"
                />
              </NavLink>
            </li>
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
            <li>
              <Button
                className="px-5"
                onClick={() => setClientModal(true)}
                variant={'outline'}
              >
                Área do Cliente
              </Button>
              <Modal
                isVisible={openClientModal}
                onClose={() => setClientModal(false)}
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
            </li>
            <li>
              <Button
                className="px-5"
                onClick={() => setPartnerModal(true)}
                variant={'outline'}
              >
                Área do Parceiro
              </Button>
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
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <Button
            className="md:hidden"
            variant={'ghost'}
            onClick={onToggleMenu}
          >
            <Menu className="text-3xl" />
          </Button>
        </div>
      </nav>
    </header>
  )
}
