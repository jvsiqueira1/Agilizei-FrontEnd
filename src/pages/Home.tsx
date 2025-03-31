import { Footer, Header, Modal, ClientForm, PartnerForm } from '@/components'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [openBudgetModal, setBudgetModal] = useState(false)
  const [openPartnerModal, setPartnerModal] = useState(false)

  useEffect(() => {
    document.body.style.overflowX = 'hidden'

    return () => {
      document.body.style.overflowX = ''
    }
  }, [])
  return (
    <>
      <Header />
      <section className="bg-light-gray flex flex-col items-center justify-center min-h-screen text-center overflow-x-hidden max-w-full">
        <h1 className="text-xl md:text-2xl font-semibold leading-snug mb-16">
          Conectando você aos melhores profissionais do mercado
        </h1>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setBudgetModal(true)}>
            FAÇA SEU ORÇAMENTO
          </Button>
          <Modal
            isVisible={openBudgetModal}
            onClose={() => setBudgetModal(false)}
          >
            <ClientForm />
          </Modal>
          <Button onClick={() => setPartnerModal(true)}>
            SEJA NOSSO PARCEIRO
          </Button>
          <Modal
            isVisible={openPartnerModal}
            onClose={() => setPartnerModal(false)}
          >
            <PartnerForm />
          </Modal>
        </div>
      </section>
      <Footer />
    </>
  )
}
