import { FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-white px-4 md:px-16 lg:px-36 w-[92%] mx-auto mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <img src="agilizeiLogo.svg" alt="Agilizei Logo" className="mb-4" />
          <p className="text-gray">© 2025 DNC. All rights reserved.</p>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Contato</h2>
          <ul>
            <li>arsacompany.agilizei@gmail.com</li>
            <li>(27) 99982-5511</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Siga-nos</h2>
          <ul className="flex space-x-4">
            <li>
              <FaInstagram />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
