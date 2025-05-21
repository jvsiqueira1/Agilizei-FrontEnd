import { Footer, Header, Modal, ClientForm, PartnerForm } from '@/components'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMenu } from '@/contexts/useMenu'

export default function Home() {
  const [openBudgetModal, setBudgetModal] = useState(false)
  const [openPartnerModal, setPartnerModal] = useState(false)
  const { openMenu } = useMenu()

  useEffect(() => {
    document.body.style.overflowX = 'hidden'

    return () => {
      document.body.style.overflowX = ''
    }
  }, [])
  return (
    <>
      <Header />
      <section
        className={`bg-light-gray flex flex-col items-center justify-center min-h-svh text-center overflow-x-hidden w-full max-w-full ${openMenu ? 'blur-sm pointer-events-none select-none' : ''}`}
      >
        <div className="md:w-1/2 p-4 flex justify-center mb-16">
          <img
            src="agilizei.png"
            alt="Descrição da imagem"
            className="rounded-lg w-48 h-48"
          />
        </div>
        <h1 className="text-xl md:text-2xl font-semibold leading-snug mb-16">
          Conectando você aos melhores profissionais do mercado
        </h1>
        <div className="flex flex-wrap gap-4 justify-center items-center w-full">
          <Button onClick={() => setBudgetModal(true)}>
            FAÇA SEU ORÇAMENTO
          </Button>
          <Button onClick={() => setPartnerModal(true)}>
            SEJA NOSSO PARCEIRO
          </Button>
        </div>
      </section>
      <Footer />

      <Modal isVisible={openBudgetModal} onClose={() => setBudgetModal(false)}>
        <ClientForm onClose={() => setBudgetModal(false)} />
      </Modal>
      <Modal
        isVisible={openPartnerModal}
        onClose={() => setPartnerModal(false)}
      >
        <PartnerForm />
      </Modal>
    </>
  )
}
