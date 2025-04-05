import { Header, Footer } from '../components';
import { FaBroom, FaBolt, FaPaintBrush, FaTools, FaTree, FaTruck } from 'react-icons/fa'; 
import { motion } from 'framer-motion';
import { useState } from 'react';
import Modal from '../components/Modal'; 
import { Button } from '../components/ui/button'; 
import { Input } from '../components/ui/input'; 

export default function Services() {
  const [openClientModal, setClientModal] = useState(false);

  return (
    <>
      <Header />
      <section className="hero bg-white text-black text-center p-8">
        <h1 className="text-4xl font-bold">Serviços disponíveis</h1>
        <p className="mt-4">Encontre o profissional perfeito para resolver sua necessidade - rápido, seguro e sem complicação!</p>
      </section>
      
      <section className="services grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
        <motion.div className="service-card bg-[#DB4E1E] shadow-lg p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Faxineira</h2>
            <FaBroom className="text-white text-5xl" />
          </div>
          <p className="text-white">Limpeza residencial, pós-obra, lavagem de estofados, organização de ambientes.</p>
        </motion.div>
        
        <motion.div className="service-card bg-[#DB4E1E] shadow-lg p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Eletricista</h2>
            <FaBolt className="text-white text-5xl" />
          </div>
          <p className="text-white">Instalação de tomadas, reparos em fiação, troca de disjuntores.</p>
        </motion.div>

        <motion.div className="service-card bg-[#DB4E1E] shadow-lg p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Pintor</h2>
            <FaPaintBrush className="text-white text-5xl" />
          </div>
          <p className="text-white">Pintura residencial e comercial, preparação de paredes.</p>
        </motion.div>

        <motion.div className="service-card bg-[#DB4E1E] shadow-lg p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Montador de Móveis</h2>
            <FaTools className="text-white text-5xl" />
          </div>
          <p className="text-white">Montagem de móveis planejados, eletrodomésticos.</p>
        </motion.div>

        <motion.div className="service-card bg-[#DB4E1E] shadow-lg p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Jardineiro</h2>
            <FaTree className="text-white text-5xl" />
          </div>
          <p className="text-white">Poda de plantas, paisagismo, limpeza de jardins.</p>
        </motion.div>

        <motion.div className="service-card bg-[#DB4E1E] shadow-lg p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Freteiro</h2>
            <FaTruck className="text-white text-5xl" />
          </div>
          <p className="text-white">Transporte de móveis, mudanças, entregas rápidas.</p>
        </motion.div>
      </section>

      <section className="how-it-works text-center p-8">
        <h2 className="text-2xl font-bold">Como funciona?</h2><br></br>
        <div className="relative">
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-4">
              <div className="w-10 h-1 bg-[#DB4E1E] mx-2"></div>
              <div className="ml-2">
                <h3 className="font-semibold text-black">1. Escolha seu serviço</h3>
              </div>
              <div className="w-10 h-1 bg-[#DB4E1E] mx-2"></div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-1 bg-[#DB4E1E] mx-2"></div>
              <div className="ml-2">
                <h3 className="font-semibold text-black">2. Descreva sua necessidade</h3>
              </div>
              <div className="w-10 h-1 bg-[#DB4E1E] mx-2"></div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-1 bg-[#DB4E1E] mx-2"></div>
              <div className="ml-2">
                <h3 className="font-semibold text-black">3. Receba orçamentos em minutos</h3>
              </div>
              <div className="w-10 h-1 bg-[#DB4E1E] mx-2"></div>
            </div>
          </div>
        </div>
        <Button className="px-5 fixed bottom-24 right-4 bg-[#DB4E1E] text-white text-lg animate-pulse" onClick={() => setClientModal(true)} variant="outline">Contratar agora!</Button>
      </section>

      <Modal isVisible={openClientModal} onClose={() => setClientModal(false)}>
        <div className="flex flex-col justify-center items-center gap-6">
          <img src="agilizeiLogo.svg" alt="Agilizei Logo" />
          <div className="flex flex-col gap-2">
            <label>Digite seu nome</label>
            <Input type="text" placeholder="Nome" required />
          </div>
          <div className="flex flex-col gap-2">
            <label>Digite seu telefone</label>
            <Input type="tel" placeholder="Telefone" required />
          </div>
          <Button type="submit" className="w-48">
            Entrar
          </Button>
        </div>
      </Modal>

      <Footer />
    </>
  );
}
