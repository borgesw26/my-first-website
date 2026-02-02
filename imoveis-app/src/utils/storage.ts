import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase';
import { Property, Transaction } from '../types';

const PROPERTIES_COLLECTION = 'properties';
const TRANSACTIONS_COLLECTION = 'transactions';

// Properties CRUD
export const getProperties = async (): Promise<Property[]> => {
  const querySnapshot = await getDocs(collection(db, PROPERTIES_COLLECTION));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Property[];
};

export const addProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> => {
  const now = new Date().toISOString();
  const docRef = await addDoc(collection(db, PROPERTIES_COLLECTION), {
    ...property,
    createdAt: now,
    updatedAt: now,
  });
  return {
    ...property,
    id: docRef.id,
    createdAt: now,
    updatedAt: now,
  };
};

export const updateProperty = async (id: string, data: Partial<Property>): Promise<Property | null> => {
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  const updatedData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await updateDoc(docRef, updatedData);
  return { id, ...updatedData } as Property;
};

export const deleteProperty = async (id: string): Promise<boolean> => {
  try {
    // Delete the property
    await deleteDoc(doc(db, PROPERTIES_COLLECTION, id));
    
    // Delete related transactions
    const q = query(collection(db, TRANSACTIONS_COLLECTION), where('propertyId', '==', id));
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    return true;
  } catch (error) {
    console.error('Error deleting property:', error);
    return false;
  }
};

export const getPropertyById = async (id: string): Promise<Property | undefined> => {
  const properties = await getProperties();
  return properties.find(p => p.id === id);
};

// Transactions CRUD
export const getTransactions = async (): Promise<Transaction[]> => {
  const querySnapshot = await getDocs(collection(db, TRANSACTIONS_COLLECTION));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Transaction[];
};

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> => {
  const now = new Date().toISOString();
  const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
    ...transaction,
    createdAt: now,
  });
  return {
    ...transaction,
    id: docRef.id,
    createdAt: now,
  };
};

export const deleteTransaction = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, TRANSACTIONS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return false;
  }
};

export const getTransactionsByProperty = async (propertyId: string): Promise<Transaction[]> => {
  const q = query(collection(db, TRANSACTIONS_COLLECTION), where('propertyId', '==', propertyId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Transaction[];
};

// Initialize with sample data (only if database is empty)
export const initializeWithSampleData = async (): Promise<void> => {
  const properties = await getProperties();
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

  for (const p of sampleProperties) {
    await addProperty(p);
  }
};
