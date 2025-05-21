import { ReactNode, useState } from 'react'
import { MenuContext } from './MenuContext'

interface Props {
  children: ReactNode
}

export const MenuProvider = ({ children }: Props) => {
  const [openMenu, setOpenMenu] = useState(false)

  const toggleMenu = () => setOpenMenu((prev) => !prev)
  const closeMenu = () => setOpenMenu(false)

  return (
    <MenuContext.Provider value={{ openMenu, toggleMenu, closeMenu }}>
      {children}
    </MenuContext.Provider>
  )
}
