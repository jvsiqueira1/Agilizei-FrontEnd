import { Header, Footer } from '@/components'
import { useMenu } from '@/contexts/useMenu'

export default function Services() {
  const { openMenu } = useMenu()
  return (
    <>
      <Header />
      <div
        className={`${openMenu ? 'blur-sm pointer-events-none select-none' : ''}`}
      >
        <h1>Serviços</h1>
      </div>
      <Footer />
    </>
  )
}
