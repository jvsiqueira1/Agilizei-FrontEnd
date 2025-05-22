import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaBroom,
  FaBolt,
  FaPaintBrush,
  FaTools,
  FaTree,
  FaTruck,
  FaHammer,
  FaWrench,
} from 'react-icons/fa'
import { Header, Footer, Modal, ClientForm, OtherServices } from '@/components'
import { Button } from '@/components/ui/button'
import { useMenu } from '@/contexts/useMenu'
import { api } from '@/services/api'

const iconMap: Record<string, React.ReactNode> = {
  Faxineira: <FaBroom className="text-white text-5xl" />,
  Eletricista: <FaBolt className="text-white text-5xl" />,
  Pintor: <FaPaintBrush className="text-white text-5xl" />,
  'Montador de Móveis': <FaTools className="text-white text-5xl" />,
  Jardineiro: <FaTree className="text-white text-5xl" />,
  Freteiro: <FaTruck className="text-white text-5xl" />,
  Pedreiro: <FaHammer className="text-white text-5xl" />,
}

export default function Services() {
  const { openMenu } = useMenu()
  const [clientModal, setClientModal] = useState<false | 'form' | 'outros'>(
    false,
  )
  const [servicos, setServicos] = useState<
    { id: number; nome: string; descricao: string }[]
  >([])
  const [selectedServico, setSelectedServico] = useState<string | undefined>(
    undefined,
  )

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const response = await api.get('/tipos-servico')
        const tipos = response.data.data.filter(
          (servico: { active: boolean }) => servico.active,
        )

        if (Array.isArray(tipos)) {
          setServicos(tipos)
        } else {
          console.error('Resposta inesperada da API:', response.data)
          setServicos([])
        }
      } catch (error) {
        console.error('Erro ao buscar tipos de serviço:', error)
      }
    }

    fetchServicos()
  }, [])

  const abrirFormComServico = (nomeServico: string) => {
    setSelectedServico(nomeServico)
    setClientModal('form')
  }

  return (
    <>
      <Header />
      <section
        className={`hero bg-light-gray text-black text-center p-8 ${
          openMenu ? 'blur-sm pointer-events-none select-none' : ''
        }`}
      >
        <h1 className="text-4xl font-bold">Serviços disponíveis</h1>
        <p className="mt-4">
          Encontre o profissional perfeito para resolver sua necessidade -
          rápido, seguro e sem complicação!
        </p>
      </section>

      <section className="services grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {servicos.map((servico) => (
          <motion.div
            key={servico.id}
            className={`service-card bg-orange shadow-lg p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105
             flex flex-col justify-between min-h-[150px] w-full mx-auto ${
               openMenu ? 'blur-sm pointer-events-none select-none' : ''
             }`}
            onClick={() => abrirFormComServico(servico.nome)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                {servico.nome}
              </h2>
              <span>
                {iconMap[servico.nome] ?? (
                  <FaWrench className="text-white text-5xl" />
                )}
              </span>
            </div>
            <p className="text-white">{servico.descricao}</p>
          </motion.div>
        ))}
        <motion.div
          className={`service-card bg-orange shadow-lg p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105
           flex flex-col justify-between min-h-[150px] w-full mx-auto cursor-pointer ${
             openMenu ? 'blur-sm pointer-events-none select-none' : ''
           }`}
          onClick={() => setClientModal('outros')}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Outro serviço</h2>
            <FaWrench className="text-white text-5xl" />
          </div>
          <p className="text-white">
            Não achou o serviço que procura? Fale com a gente clicando aqui!
          </p>
        </motion.div>
      </section>

      <Button
        className="px-5 fixed right-4 bottom-12 z-50 bg-orange text-white text-lg animate-pulse"
        onClick={() => {
          setClientModal('form')
        }}
        variant="outline"
      >
        Contratar agora!
      </Button>

      <Modal isVisible={!!clientModal} onClose={() => setClientModal(false)}>
        {clientModal === 'form' && (
          <ClientForm
            onClose={() => setClientModal(false)}
            selectedServico={selectedServico}
          />
        )}
        {clientModal === 'outros' && (
          <OtherServices onClose={() => setClientModal(false)} />
        )}
      </Modal>

      <section
        className={`how-it-works text-center p-8 ${
          openMenu ? 'blur-sm pointer-events-none select-none' : ''
        }`}
      >
        <h2 className="text-2xl font-bold">Como funciona?</h2>
        <br />
        <div className="relative">
          <div className="flex flex-col items-center">
            {[
              '1. Escolha seu serviço',
              '2. Descreva sua necessidade',
              '3. Receba orçamentos em minutos',
            ].map((step, index) => (
              <div key={index} className="flex items-center mb-4">
                <div className="w-10 h-1 bg-[#DB4E1E] mx-2" />
                <div className="ml-2">
                  <h3 className="font-semibold text-black">{step}</h3>
                </div>
                <div className="w-10 h-1 bg-[#DB4E1E] mx-2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
