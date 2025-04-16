export interface Budget {
  id: string;
  professional: string;
  value: number;
  rating: number;
  description?: string;
}

export interface Service {
  id: string;
  title: string;
  professional?: string;
  status: "budget" | "scheduled" | "in_progress" | "completed";
  date: string;
  rating?: number;
  budgets?: Budget[];
  finalValue?: number;
}

export const services: Service[] = [
  {
    id: "1",
    title: "Montagem de guarda-roupa",
    status: "budget",
    date: "10/04/2024",
    budgets: [
      {
        id: "1-1",
        professional: "Carlos Montagens",
        value: 1200,
        rating: 4.5,
        description: "Inclui transporte e material"
      },
      {
        id: "1-2", 
        professional: "Móveis Express",
        value: 950,
        rating: 4.2,
        description: "Apenas mão de obra"
      }
    ]
  },
  {
    id: "2",
    title: "Limpeza residencial",
    professional: "Maria Silva",
    status: "scheduled",
    date: "15/04/2024",
  },
  {
    id: "3",
    title: "Instalação elétrica",
    professional: "João Costa",
    status: "completed",
    date: "05/04/2024",
    rating: 5,
  },
];
