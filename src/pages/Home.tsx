import Header from '../components/Header'
import Footer from '../components/Footer'
import Button from '../components/Button'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    document.body.style.overflowX = 'hidden'

    return () => {
      document.body.style.overflowX = ''
    }
  }, [])
  return (
    <>
      <Header />
      <section className="flex flex-col items-center justify-center min-h-screen text-center overflow-x-hidden max-w-full">
        <h1 className="text-xl md:text-2xl font-semibold leading-snug mb-16">
          Conectando você aos melhores profissionais do mercado
        </h1>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-orange text-white border-none hover:bg-light-orange">
            FAÇA SEU ORÇAMENTO
          </Button>
          <Button className="bg-orange text-white border-none hover:bg-light-orange">
            SEJA NOSSO PARCEIRO
          </Button>
        </div>
      </section>
      <Footer />
    </>
  )
}
