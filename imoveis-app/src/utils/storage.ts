import { Property, Transaction } from '../types';

const PROPERTIES_KEY = 'imoveis_properties';
const TRANSACTIONS_KEY = 'imoveis_transactions';

// Properties CRUD
export const getProperties = (): Property[] => {
  const data = localStorage.getItem(PROPERTIES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProperties = (properties: Property[]): void => {
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
};

export const addProperty = (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property => {
  const properties = getProperties();
  const newProperty: Property = {
    ...property,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  properties.push(newProperty);
  saveProperties(properties);
  return newProperty;
};

export const updateProperty = (id: string, data: Partial<Property>): Property | null => {
  const properties = getProperties();
  const index = properties.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  properties[index] = {
    ...properties[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveProperties(properties);
  return properties[index];
};

export const deleteProperty = (id: string): boolean => {
  const properties = getProperties();
  const filtered = properties.filter(p => p.id !== id);
  if (filtered.length === properties.length) return false;
  saveProperties(filtered);
  
  // Also delete related transactions
  const transactions = getTransactions();
  const filteredTx = transactions.filter(t => t.propertyId !== id);
  saveTransactions(filteredTx);
  
  return true;
};

export const getPropertyById = (id: string): Property | undefined => {
  const properties = getProperties();
  return properties.find(p => p.id === id);
};

// Transactions CRUD
export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  transactions.push(newTransaction);
  saveTransactions(transactions);
  return newTransaction;
};

export const deleteTransaction = (id: string): boolean => {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  if (filtered.length === transactions.length) return false;
  saveTransactions(filtered);
  return true;
};

export const getTransactionsByProperty = (propertyId: string): Transaction[] => {
  const transactions = getTransactions();
  return transactions.filter(t => t.propertyId === propertyId);
};

// Initialize with sample data from Excel
export const initializeWithSampleData = (): void => {
  const properties = getProperties();
  if (properties.length > 0) return; // Already initialized

  // Excel serial date to JS date conversion
  const excelToDate = (serial: number): string => {
    const utc_days = Math.floor(serial - 25569);
    const date = new Date(utc_days * 86400 * 1000);
    return date.toISOString().split('T')[0];
  };

  const sampleProperties: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'LUDCO',
      unit: '1301',
      area: 180.67,
      propertyValue: 1490000,
      rentValue: 6405,
      condoFee: 1416.69,
      iptu: 996.26,
      extraFee: 420.18,
      tenant: 'LEILA',
      startDate: excelToDate(45342),
      endDate: excelToDate(46437),
      dueDay: 1,
      netValue: 5984.82,
      notes: 'Greenville, Edf.: Avalon - 4 quartos 3 garagens',
      status: 'occupied',
    },
    {
      name: 'AQUARIUS',
      unit: '1305',
      area: 50.05,
      propertyValue: 420000,
      rentValue: 1700,
      condoFee: 749.24,
      iptu: 195.02,
      extraFee: 0,
      tenant: 'JULIETE',
      startDate: excelToDate(45678),
      endDate: excelToDate(46772),
      dueDay: 21,
      netValue: 1700,
      notes: 'Avenida Professor Magalhães Neto - 1 quarto 1 garagem',
      status: 'occupied',
    },
    {
      name: 'AQUARIUS',
      unit: '1103',
      area: 50.05,
      propertyValue: 415000,
      rentValue: 1791.73,
      condoFee: 749.24,
      iptu: 195.02,
      extraFee: 33.04,
      tenant: 'JAIR',
      startDate: excelToDate(45394),
      endDate: excelToDate(46478),
      dueDay: 12,
      netValue: 1758.69,
      notes: 'Avenida Professor Magalhães Neto - 1 quarto 1 garagem',
      status: 'occupied',
    },
    {
      name: 'AQUARIUS',
      unit: '1201',
      area: 79.17,
      propertyValue: 620000,
      rentValue: 1800,
      condoFee: 1217.40,
      iptu: 181.34,
      extraFee: 0,
      tenant: 'NADJA',
      startDate: excelToDate(46024),
      endDate: excelToDate(46235),
      dueDay: 5,
      netValue: 1930,
      notes: 'Avenida Professor Magalhães Neto - 2 quartos 1 garagem',
      status: 'occupied',
    },
    {
      name: 'VITORIA',
      unit: '202',
      area: 49,
      propertyValue: 500000,
      rentValue: 2700,
      condoFee: 0,
      iptu: 0,
      extraFee: 0,
      tenant: '',
      startDate: '',
      endDate: '',
      dueDay: 1,
      netValue: 2700,
      notes: 'Av 7 de Setembro - 1 quarto 1 garagem',
      status: 'vacant',
    },
    {
      name: 'VILAGE ITAP',
      unit: '10',
      area: 0,
      propertyValue: 700000,
      rentValue: 0,
      condoFee: 0,
      iptu: 0,
      extraFee: 0,
      tenant: '',
      startDate: '',
      endDate: '',
      dueDay: 1,
      netValue: 0,
      notes: '',
      status: 'vacant',
    },
  ];

  sampleProperties.forEach(p => addProperty(p));
};
