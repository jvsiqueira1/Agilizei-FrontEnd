import { createContext } from 'react'

export interface MenuContextType {
  openMenu: boolean
  toggleMenu: () => void
  closeMenu: () => void
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined)
