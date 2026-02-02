import { Property, DashboardStats, Transaction } from '../types';
import { differenceInDays, format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return dateString;
  }
};

export const formatDateFull = (dateString: string): string => {
  if (!dateString) return '-';
  try {
    return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch {
    return dateString;
  }
};

export const getDaysUntilExpiration = (endDate: string): number => {
  if (!endDate) return Infinity;
  try {
    const end = parseISO(endDate);
    const today = new Date();
    return differenceInDays(end, today);
  } catch {
    return Infinity;
  }
};

export const getExpirationStatus = (endDate: string): 'expired' | 'critical' | 'warning' | 'ok' => {
  const days = getDaysUntilExpiration(endDate);
  if (days < 0) return 'expired';
  if (days <= 30) return 'critical';
  if (days <= 90) return 'warning';
  return 'ok';
};

export const getStatusLabel = (status: Property['status']): string => {
  const labels: Record<Property['status'], string> = {
    occupied: 'Alugado',
    vacant: 'Vago',
    maintenance: 'Manutenção',
  };
  return labels[status];
};

export const getStatusColor = (status: Property['status']): string => {
  const colors: Record<Property['status'], string> = {
    occupied: 'bg-green-100 text-green-800',
    vacant: 'bg-yellow-100 text-yellow-800',
    maintenance: 'bg-red-100 text-red-800',
  };
  return colors[status];
};

export const calculateDashboardStats = (
  properties: Property[],
  _transactions: Transaction[]
): DashboardStats => {
  const totalProperties = properties.length;
  const occupiedProperties = properties.filter(p => p.status === 'occupied').length;
  const vacantProperties = properties.filter(p => p.status === 'vacant').length;
  
  const totalMonthlyIncome = properties
    .filter(p => p.status === 'occupied')
    .reduce((sum, p) => sum + p.rentValue, 0);
  
  const totalPropertyValue = properties.reduce((sum, p) => sum + p.propertyValue, 0);
  
  // Contracts expiring in the next 90 days
  const expiringContracts = properties
    .filter(p => {
      if (!p.endDate || p.status !== 'occupied') return false;
      const days = getDaysUntilExpiration(p.endDate);
      return days >= 0 && days <= 90;
    })
    .sort((a, b) => getDaysUntilExpiration(a.endDate) - getDaysUntilExpiration(b.endDate));

  return {
    totalProperties,
    occupiedProperties,
    vacantProperties,
    totalMonthlyIncome,
    totalPropertyValue,
    expiringContracts,
  };
};

export const generateId = (): string => {
  return crypto.randomUUID();
};

export const getCategoryOptions = (type: 'income' | 'expense'): string[] => {
  if (type === 'income') {
    return ['Aluguel', 'Reajuste', 'Multa', 'Caução', 'Outros'];
  }
  return [
    'Condomínio',
    'IPTU',
    'Manutenção',
    'Reforma',
    'Comissão Imobiliária',
    'Seguro',
    'Documentação',
    'Outros',
  ];
};
