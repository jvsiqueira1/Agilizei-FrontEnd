import { useContext } from 'react'
import { MenuContext } from './MenuContext'

export const useMenu = () => {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenu deve ser usado dentro de MenuProvider')
  }
  return context
}
