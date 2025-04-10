import { Header, Footer } from '@/components'
import { useMenu } from '@/contexts/useMenu'
import {
  FaBroom,
  FaBolt,
  FaPaintBrush,
  FaTools,
  FaTree,
  FaTruck,
  FaHammer,
} from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ClientForm, Modal } from '@/components'

export default function Services() {
  const { openMenu } = useMenu()
  const [clientModal, setClientModal] = useState(false)

  return (
    <>
      <Header />
      <section
        className={`hero bg-light-gray text-black text-center p-8 ${openMenu ? 'blur-sm pointer-events-none select-none' : ''}`}
      >
        <h1 className="text-4xl font-bold">Serviços disponíveis</h1>
        <p className="mt-4">
          Encontre o profissional perfeito para resolver sua necessidade -
          rápido, seguro e sem complicação!
        </p>
      </section>

      <section className="services grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
        <motion.div className="service-card bg-[#DB4E1E] shadow-lg p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Faxineira</h2>
            <FaBroom className="text-white text-5xl" />
          </div>
          <p className="text-white">
            Limpeza residencial, pós-obra, lavagem de estofados, organização de
            ambientes.
          </p>
        </motion.div>

        <motion.div className="service-card bg-[#DB4E1E] shadow-lg p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Eletricista</h2>
            <FaBolt className="text-white text-5xl" />
          </div>
          <p className="text-white">
            Instalação de tomadas, reparos em fiação, troca de disjuntores.
          </p>
        </motion.div>

        <motion.div className="service-card bg-[#DB4E1E] shadow-lg p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Pintor</h2>
            <FaPaintBrush className="text-white text-5xl" />
          </div>
          <p className="text-white">
            Pintura residencial e comercial, preparação de paredes.
          </p>
        </motion.div>

        <motion.div className="service-card bg-[#DB4E1E] shadow-lg p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Montador de Móveis
            </h2>
            <FaTools className="text-white text-5xl" />
          </div>
          <p className="text-white">
            Montagem de móveis planejados, eletrodomésticos.
          </p>
        </motion.div>

        <motion.div className="service-card bg-[#DB4E1E] shadow-lg p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Jardineiro</h2>
            <FaTree className="text-white text-5xl" />
          </div>
          <p className="text-white">
            Poda de plantas, paisagismo, limpeza de jardins.
          </p>
        </motion.div>

        <motion.div className="service-card bg-[#DB4E1E] shadow-lg p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Freteiro</h2>
            <FaTruck className="text-white text-5xl" />
          </div>
          <p className="text-white">
            Transporte de móveis, mudanças, entregas rápidas.
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div className="service-card bg-[#DB4E1E] shadow-lg p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Pedreiro</h2>
              <FaHammer className="text-white text-5xl" />
            </div>
            <p className="text-white">
              Construção e reforma de ambientes, assentamento de pisos, e muito
              mais para transformar seu espaço!
            </p>
          </motion.div>
        </div>
      </section>

      <Button
        className="px-5 fixed right-4 bottom-12 bg-[#DB4E1E] text-white text-lg animate-pulse"
        onClick={() => setClientModal(true)}
        variant="outline"
      >
        Contratar agora!
      </Button>

      <Modal isVisible={clientModal} onClose={() => setClientModal(false)}>
        <ClientForm />
      </Modal>

      <section className="how-it-works text-center p-8">
        <h2 className="text-2xl font-bold">Como funciona?</h2>
        <br></br>
        <div className="relative">
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-4">
              <div className="w-10 h-1 bg-[#DB4E1E] mx-2"></div>
              <div className="ml-2">
                <h3 className="font-semibold text-black">
                  1. Escolha seu serviço
                </h3>
              </div>
              <div className="w-10 h-1 bg-[#DB4E1E] mx-2"></div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-1 bg-[#DB4E1E] mx-2"></div>
              <div className="ml-2">
                <h3 className="font-semibold text-black">
                  2. Descreva sua necessidade
                </h3>
              </div>
              <div className="w-10 h-1 bg-[#DB4E1E] mx-2"></div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-1 bg-[#DB4E1E] mx-2"></div>
              <div className="ml-2">
                <h3 className="font-semibold text-black">
                  3. Receba orçamentos em minutos
                </h3>
              </div>
              <div className="w-10 h-1 bg-[#DB4E1E] mx-2"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
