export interface Property {
  id: string;
  name: string;           // Nome do edifício (ex: LUDCO, AQUARIUS)
  unit: string;           // Unidade (ex: 1301, 1305)
  area: number;           // M2
  propertyValue: number;  // Valor do imóvel
  rentValue: number;      // Valor do aluguel
  condoFee: number;       // Condomínio
  iptu: number;           // IPTU
  extraFee: number;       // Cota extra
  tenant: string;         // Inquilino
  startDate: string;      // Início do aluguel (ISO date)
  endDate: string;        // Término do aluguel (ISO date)
  dueDay: number;         // Dia de vencimento mensal
  netValue: number;       // Valor líquido
  notes: string;          // Outras informações
  status: 'occupied' | 'vacant' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  propertyId: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  createdAt: string;
}

export type PropertyFormData = Omit<Property, 'id' | 'createdAt' | 'updatedAt'>;

export interface DashboardStats {
  totalProperties: number;
  occupiedProperties: number;
  vacantProperties: number;
  totalMonthlyIncome: number;
  totalPropertyValue: number;
  expiringContracts: Property[];
}
