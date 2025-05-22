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
      className={`w-full bg-light-gray border-t-2 p-10 mb-6 md:px-16 overflow-x-hidden ${
        openMenu ? 'blur-sm pointer-events-none select-none' : ''
      }`}
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <img
            src="agilizeiLogo.svg"
            alt="Agilizei Logo"
            className="mb-4 mt-1"
          />
          <p className="text-gray">
            © {new Date().getFullYear()} Agilizei. Todos os direitos
            reservados.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Contato</h2>
          <ul>
            <li>arsacompany.agilizei@gmail.com</li>
            <li>(27) 99956-8341</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Siga-nos</h2>
          <ul className="flex space-x-4">
            <li>
              <a
                href="https://www.instagram.com/agilizeiapp/"
                target="_blank"
                rel="noreferrer"
              >
                <p className="flex items-center gap-1">
                  <FaInstagram />
                  agilizeiapp
                </p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
