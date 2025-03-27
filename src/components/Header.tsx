import { useState } from 'react'
import { NavLink } from 'react-router'
import { Modal } from '@/components'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [openClientModal, setClientModal] = useState(false)
  const [openPartnerModal, setPartnerModal] = useState(false)

  return (
    <header className="w-screen bg-white flex justify-between p-8">
      <nav className="flex justify-between items-center w-[92%] mx-auto">
        <div>
          <NavLink to="/">
            <img src="agilizeiLogo.svg" alt="Agilizei Logo" />
          </NavLink>
        </div>
        <div className="">
          <ul className="flex items-center gap-[4vw]">
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
        <div className="flex gap-4">
          <Button onClick={() => setClientModal(true)} variant={'outline'}>
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
          <Button onClick={() => setPartnerModal(true)} variant={'outline'}>
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
        </div>
      </nav>
    </header>
  )
}
