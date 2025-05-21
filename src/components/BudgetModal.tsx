import React, { useState } from 'react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  onSubmit: (description: string, value: number) => void;
  isAccepted: boolean; // New prop to indicate if the budget is accepted
  isInactive: boolean; // New prop to indicate if the budget is inactive
  attachments?: string[]; // New prop for attachments
}

const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, serviceTitle, onSubmit, isAccepted, isInactive, attachments }) => {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    onSubmit(description, parseFloat(value.replace('R$', '').replace(',', '.').trim()));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>Orçamento para {serviceTitle}</h2>
      {attachments && attachments.length > 0 ? (
        <div className="mb-4">
          <h4 className="font-medium">Anexos:</h4>
          {attachments.map((attachment, index) => (
            <img key={index} src={attachment} alt={`Anexo ${index + 1}`} className="w-32 h-32 object-cover mb-2" /> // Render images
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Não existem anexos</p> // Message when no attachments
      )}
      <textarea
        placeholder="Observações do Serviço"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded-md p-2 w-full h-32"
        disabled={isAccepted || isInactive} // Disable textarea if budget is accepted or inactive
      />
      <input
        type="text"
        placeholder="R$ 0,00"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border rounded-md p-2 w-full mt-2"
        disabled={isAccepted || isInactive} // Disable input if budget is accepted or inactive
      />
      <div className="flex justify-start mt-4 space-x-2">
        <button 
          className="bg-[#DB4E1E] hover:bg-[#C7451A] text-white px-3 py-1 rounded text-sm font-medium"
          onClick={handleSubmit}
          disabled={isAccepted || isInactive} // Disable button if budget is accepted or inactive
        >
          Enviar Orçamento
        </button>
        <button 
          className="bg-[#DB4E1E] hover:bg-[#C7451A] text-white px-3 py-1 rounded text-sm font-medium"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default BudgetModal;
