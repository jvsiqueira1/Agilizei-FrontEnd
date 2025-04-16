import { Header, Footer } from '../components';
import { services } from '../services/servicesMock';
import { useState } from 'react';

interface Budget {
  id: string;
  professional: string;
  value: number;
  rating: number;
  description?: string;
  estimatedDate?: string;
}

interface Service {
  id: string;
  title: string;
  professional?: string;
  status: "budget" | "scheduled" | "in_progress" | "completed";
  date: string;
  rating?: number;
  budgets?: Budget[];
  finalValue?: number;
}

export default function ClientFinal() {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');

  const ongoingServices = services.filter(service => 
    ['budget', 'scheduled', 'in_progress'].includes(service.status)
  );

  const completedServices = services.filter(service => service.status === 'completed');

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Meus Serviços</h1>
        
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-6 py-3 font-medium rounded ${activeTab === 'ongoing' ? 'bg-[#DB4E1E] text-white' : 'bg-white text-[#DB4E1E]'}`}
            onClick={() => setActiveTab('ongoing')}
          >
            Em Andamento
          </button>
          <button
            className={`px-6 py-3 font-medium rounded ${activeTab === 'completed' ? 'bg-[#DB4E1E] text-white' : 'bg-white text-[#DB4E1E]'}`}
            onClick={() => setActiveTab('completed')}
          >
            Finalizados
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'ongoing' ? ongoingServices : completedServices).map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

const ServiceCard = ({ service }: { service: Service }) => {
  const [showBudgetsModal, setShowBudgetsModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleAcceptBudget = (budgetId: string) => {
    console.log(`Budget ${budgetId} accepted`);
    setShowBudgetsModal(false);
  };

  const statusColors = {
    budget: 'bg-yellow-100 text-yellow-800',
    scheduled: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800'
  };

  const statusText = {
    budget: 'Orçamento Pendente',
    scheduled: 'Agendado',
    in_progress: 'Em Execução',
    completed: 'Concluído'
  };

  const BudgetsModal = ({ budgets, onClose, onAccept }: { 
    budgets: Budget[], 
    onClose: () => void,
    onAccept: (id: string) => void
  }) => {
    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[calc(100vh-4rem)] overflow-y-auto relative">
          <h3 className="font-bold text-lg mb-4">Orçamentos Disponíveis</h3>
          {budgets.map((budget) => (
            <div key={budget.id} className="border-b py-3">
              <p className="font-semibold">{budget.professional}</p>
              <div className="flex items-center my-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i} 
                    className={`w-4 h-4 ${i < budget.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-center text-gray-600 mb-1">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>R$ {budget.value.toFixed(2)}</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Previsão: {budget.estimatedDate || 'A combinar'}</span>
              </div>
              {budget.description && (
                <p className="text-sm text-gray-500 mt-1">{budget.description}</p>
              )}
              <button 
                className="bg-[#DB4E1E] hover:bg-[#C7451A] text-white px-3 py-1 rounded mt-2 text-sm font-medium"
                onClick={() => onAccept(budget.id)}
              >
                Aceitar Orçamento
              </button>
            </div>
          ))}
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            aria-label="Fechar"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  };

  return (
      <>
        <div className="border rounded-lg p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">{service.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[service.status]}`}>
              {statusText[service.status]}
            </span>
          </div>

          {service.professional && (
            <p className="mb-2">
              <span className="font-medium">Profissional:</span> {service.professional}
            </p>
          )}

          <p className="mb-4 flex justify-between items-center">
            <span>
              <span className="font-medium">Data:</span> {service.date}
            </span>
            {service.status === 'budget' && service.budgets && (
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                {service.budgets.length} orçamentos
              </span>
            )}
          </p>

        {service.status === 'completed' && (
          <div className="flex items-center mb-4">
            <span className="font-medium mr-2">Avaliação:</span>
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${service.rating && i < service.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          {service.status !== 'completed' && (
            <button className="bg-[#DB4E1E] hover:bg-[#C7451A] text-white px-3 py-1 rounded text-sm font-medium">
              Cancelar
            </button>
          )}
          {service.status === 'budget' && service.budgets && (
            <button 
              className="bg-[#DB4E1E] hover:bg-[#C7451A] text-white px-3 py-1 rounded text-sm font-medium"
              onClick={() => {
                setSelectedService(service);
                setShowBudgetsModal(true);
              }}
            >
              Ver orçamentos
            </button>
          )}
          {service.status === 'completed' && (
            <button className="bg-[#DB4E1E] hover:bg-[#C7451A] text-white px-3 py-1 rounded text-sm font-medium">
              Solicitar Novamente
            </button>
          )}
        </div>
      </div>
      {showBudgetsModal && selectedService?.budgets && (
        <BudgetsModal 
          budgets={selectedService.budgets}
          onClose={() => setShowBudgetsModal(false)}
          onAccept={handleAcceptBudget}
        />
      )}
    </>
  );
};
