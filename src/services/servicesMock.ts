export interface Budget {
  id: string;
  professional: string;
  value?: number; // Made value optional
  rating: number;
  description?: string;
  bairro?: string; // Added bairro field
  attachments?: string[]; // Added attachments field
}

export interface Service {
  id: string;
  title: string;
  professional?: string;
  status: "budget" | "scheduled" | "in_progress" | "completed" | "submitted" | "not_chosen"; // Added new statuses
  date: string;
  rating?: number;
  budgets?: Budget[];
  finalValue?: number;
}

export const services: Service[] = [
  {
    id: "1",
    title: "Montagem de guarda-roupa",
    status: "budget", // Não enviado
    date: "10/04/2024",
    budgets: [
      {
        id: "1-1",
        professional: "Montagens Rápidas",
        rating: 4,
        description: "Montagem de guarda-roupa de 6 portas com espelho.",
        bairro: "Centro", // Example neighborhood
        attachments: ["./images/placeholder.jpg"] // Reference to the placeholder image in the images folder
      }
    ],
  },
  {
    id: "2",
    title: "Limpeza residencial",
    professional: "Maria Silva",
    status: "submitted", // Em análise
    date: "15/04/2024",
    budgets: [
      {
        id: "2-1",
        professional: "Carlos Montagens",
        value: 1200,
        rating: 4.5,
        description: "Inclui transporte e material",
        bairro: "Centro", // Example neighborhood
        attachments: ["./images/placeholder.jpg"] // Reference to the placeholder image in the images folder
      }
    ]
  },
  {
    id: "3",
    title: "Instalação elétrica",
    professional: "João Costa",
    status: "completed", // Aceito
    date: "05/04/2024",
    rating: 5,
    budgets: [
      {
        id: "3-1",
        professional: "João Costa",
        value: 1500,
        rating: 5,
        description: "Serviço completo",
        bairro: "Jardim", // Example neighborhood
        attachments: [] // No attachments
      }
    ]
  },
  {
    id: "4",
    title: "Pintura de parede",
    professional: "Ana Lima",
    status: "not_chosen", // Não aceito
    date: "20/04/2024",
    budgets: [
      {
        id: "4-1",
        professional: "Pinturas Rápidas",
        value: 800,
        rating: 4.0,
        description: "Pintura interna",
        bairro: "Vila Nova", // Example neighborhood
        attachments: ["./images/placeholder.jpg"] // Reference to the placeholder image in the images folder
      }
    ]
  },
  {
    id: "5",
    title: "Orçamento de jardinagem",
    professional: "Pedro Santos",
    status: "budget", // Exemplo de orçamento não enviado
    date: "25/04/2024",
    budgets: [],
  },
];
