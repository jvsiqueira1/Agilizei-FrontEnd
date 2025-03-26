import { useState } from 'react'
import { NavLink } from 'react-router'
import { Button, Modal, Input } from './index'

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
        <div>
          <Button className="mr-1" onClick={() => setClientModal(true)}>
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
              <Button
                className="bg-orange w-56 rounded-2xl text-white border-none hover:bg-light-orange"
                type="submit"
              >
                Entrar
              </Button>
            </div>
          </Modal>
          <Button className="ml-1" onClick={() => setPartnerModal(true)}>
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
              <Button
                className="bg-orange w-56 rounded-2xl text-white border-none hover:bg-light-orange"
                type="submit"
              >
                Entrar
              </Button>
            </div>
          </Modal>
        </div>
      </nav>
    </header>
  )
}
