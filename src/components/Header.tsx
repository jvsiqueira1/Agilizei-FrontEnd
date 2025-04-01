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
    <header className="w-screen bg-light-gray flex justify-between p-8 z-50">
      <nav className="flex justify-between items-center w-[92%] mx-auto">
        <div>
          <NavLink to="/">
            <img
              className="w-32 mt-4 md:mt-6"
              src="agilizeiLogo.svg"
              alt="Agilizei Logo"
            />
          </NavLink>
        </div>
        <div
          className={`flex items-center px-5 md:static md:flex-row md:h-auto md:min-h-fit md:w-auto md:top-auto md:left-auto fixed top-0 left-0 h-screen w-[70%] max-w-sm flex-col bg-light-gray max-md:z-40 transition-all duration-300 ease-in-out ${openMenu ? 'left-0 opacity-100 visible' : 'md:opacity-100 md:visible -left-full opacity-0 invisible'}`}
        >
          <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 mt-6">
            <li>
              <NavLink to="/">
                <img
                  className="w-32 mt-4"
                  src="agilizeiLogo.svg"
                  alt="Agilizei Logo"
                  onClick={closeMenu}
                />
              </NavLink>
            </li>
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
          <Button className="md:hidden" variant={'ghost'} onClick={toggleMenu}>
            {openMenu ? (
              <X className="text-3xl" />
            ) : (
              <Menu className="text-3xl" />
            )}
          </Button>
        </div>
      </nav>
    </header>
  )
}
