import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MenuProvider } from './contexts/MenuProvider.tsx'
import { AuthProvider } from './contexts/AuthProvider.tsx'
import { Toaster } from './components/ui/toaster.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <MenuProvider>
        <Toaster />
        <App />
      </MenuProvider>
    </AuthProvider>
  </StrictMode>,
)
