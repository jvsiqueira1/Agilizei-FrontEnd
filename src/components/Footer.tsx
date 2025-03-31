import { useEffect } from 'react'
import { FaInstagram } from 'react-icons/fa'
import { useMenu } from '@/contexts/useMenu'

export default function Footer() {
  const { openMenu } = useMenu()
  useEffect(() => {
    document.body.style.overflowX = 'hidden'

    return () => {
      document.body.style.overflowX = ''
    }
  }, [])
  return (
    <footer
      className={`bg-light-gray px-4 md:px-16 lg:px-36 mx-auto overflow-x-hidden ${openMenu ? 'blur-sm pointer-events-none select-none' : ''}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:pl-32">
        <div>
          <img
            src="agilizeiLogo.svg"
            alt="Agilizei Logo"
            className="mb-4 mt-1"
          />
          <p className="text-gray">
            {' '}
            © {new Date().getFullYear()} Agilizei. Todos os direitos
            reservados.
          </p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-4">Contato</h2>
          <ul>
            <li>arsacompany.agilizei@gmail.com</li>
            <li>(27) 99982-5511</li>
          </ul>
        </div>
        <div className="mb-4">
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
