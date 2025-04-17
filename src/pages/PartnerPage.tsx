import { Header, Footer } from '../components';
import { services } from '../services/servicesMock';
import { useState } from 'react';

interface Partner {
  id: string;
  name: string;
  status: "active" | "inactive";
  dateJoined: string;
}

export default function PartnerPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');

  const activePartners = services.filter(partner => partner.status === 'active');
  const inactivePartners = services.filter(partner => partner.status === 'inactive');

  return (
    <div className="min-h-screen bg-white text-black">
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

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'active' ? activePartners : inactivePartners).map(partner => (
            <div key={partner.id} className="border rounded-lg p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <h3 className="text-xl font-bold">{partner.name}</h3>
              <p className="mb-2"><span className="font-medium">Status:</span> {partner.status}</p>
              <p className="mb-2"><span className="font-medium">Data de Adesão:</span> {partner.dateJoined}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
