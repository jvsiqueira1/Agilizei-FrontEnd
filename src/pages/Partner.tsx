import { Header, Footer, BudgetModal } from '../components'
import { useState } from 'react'
import { services, Service } from '../services/servicesMock' // Import Service interface
import { criarServico } from '../services/servico'

export default function Partner() {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null) // Change to Service type

  const handleOpenModal = (service: Service) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const handleSubmitBudget = async (description: string, value: number) => {
    if (selectedService) {
      await criarServico({
        servico: selectedService.title,
        descricao: description,
        foto: null,
        telefone: '',
        email: '',
        cep: '',
        logradouro: '',
        endereco: '',
        complemento: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        nome: '',
      })
      // Optionally, refresh the service list or show a success message
    }
  }

  const getServiceStatus = (service: Service) => {
    if (service.status === 'budget') {
      return 'Orçamento não enviado'
    } else if (service.status === 'submitted') {
      return 'Orçamento em Análise'
    } else if (service.status === 'not_chosen') {
      return 'Orçamento não escolhido'
    } else if (service.status === 'completed') {
      return 'Orçamento aceito'
    }
    return 'Status desconhecido'
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Área do Parceiro</h1>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-6 py-3 font-medium rounded ${activeTab === 'active' ? 'bg-[#DB4E1E] text-white' : 'bg-white text-[#DB4E1E]'}`}
            onClick={() => setActiveTab('active')}
          >
            Ativos
          </button>
          <button
            className={`px-6 py-3 font-medium rounded ${activeTab === 'inactive' ? 'bg-[#DB4E1E] text-white' : 'bg-white text-[#DB4E1E]'}`}
            onClick={() => setActiveTab('inactive')}
          >
            Inativos
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services
            .filter(
              (service) =>
                (activeTab === 'active' && service.status !== 'not_chosen') ||
                (activeTab === 'inactive' && service.status === 'not_chosen'),
            )
            .map((service) => (
              <div
                key={service.id}
                className="border rounded-lg p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => handleOpenModal(service)} // Pass the entire service object
              >
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="mb-2">
                  <span className="font-medium">Status:</span>{' '}
                  {getServiceStatus(service)}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Data:</span> {service.date}
                </p>
                {service.budgets && service.budgets.length > 0 && (
                  <div>
                    <h4 className="font-medium">Orçamentos:</h4>
                    {service.budgets.map((budget) => (
                      <p key={budget.id} className="text-sm">
                        {budget.professional}: R${' '}
                        {budget.value ? budget.value.toFixed(2) : 'N/A'} -{' '}
                        {budget.description}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>

        <BudgetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          serviceTitle={selectedService ? selectedService.title : ''}
          onSubmit={handleSubmitBudget}
          isAccepted={
            selectedService ? selectedService.status === 'completed' : false
          } // Pass isAccepted prop
          isInactive={
            selectedService ? selectedService.status === 'not_chosen' : false
          } // Pass isInactive prop
          attachments={
            selectedService
              ? selectedService.budgets?.flatMap((b) => b.attachments || [])
              : []
          } // Pass attachments, ensuring no undefined values
        />
      </main>
      <Footer />
    </>
  )
}
