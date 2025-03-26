import { NavLink } from 'react-router'
import Button from './Button'

export default function Header() {
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
          <Button className="mr-1">Área do Cliente</Button>
          <Button className="ml-1">Área do Parceiro</Button>
        </div>
      </nav>
    </header>
  )
}
