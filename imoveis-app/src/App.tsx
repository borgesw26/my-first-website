import { useState, useEffect, useCallback } from 'react';
import { Property, Transaction } from './types';
import { getProperties, getTransactions, addProperty, updateProperty, deleteProperty, addTransaction, deleteTransaction } from './utils/storage';
import { calculateDashboardStats } from './utils/helpers';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PropertyList from './components/PropertyList';
import PropertyForm from './components/PropertyForm';
import PropertyDetails from './components/PropertyDetails';
import TransactionForm from './components/TransactionForm';
import AlertsPanel from './components/AlertsPanel';

type View = 'dashboard' | 'properties' | 'property-details' | 'add-property' | 'edit-property';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [properties, setProperties] = useState<Property[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  const loadData = useCallback(() => {
    setProperties(getProperties());
    setTransactions(getTransactions());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = calculateDashboardStats(properties, transactions);

  const handleAddProperty = (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    addProperty(data);
    loadData();
    setView('properties');
  };

  const handleUpdateProperty = (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedProperty) {
      updateProperty(selectedProperty.id, data);
      loadData();
      setView('properties');
      setSelectedProperty(null);
    }
  };

  const handleDeleteProperty = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel? Todas as transações relacionadas também serão excluídas.')) {
      deleteProperty(id);
      loadData();
      if (selectedProperty?.id === id) {
        setSelectedProperty(null);
        setView('properties');
      }
    }
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setView('property-details');
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setView('edit-property');
  };

  const handleAddTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    addTransaction(data);
    loadData();
    setShowTransactionForm(false);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(id);
      loadData();
    }
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats} 
            properties={properties}
            transactions={transactions}
            onViewProperty={handleViewProperty}
            onShowAlerts={() => setShowAlerts(true)}
          />
        );
      case 'properties':
        return (
          <PropertyList 
            properties={properties}
            onView={handleViewProperty}
            onEdit={handleEditProperty}
            onDelete={handleDeleteProperty}
            onAdd={() => setView('add-property')}
          />
        );
      case 'add-property':
        return (
          <PropertyForm 
            onSubmit={handleAddProperty}
            onCancel={() => setView('properties')}
          />
        );
      case 'edit-property':
        return selectedProperty ? (
          <PropertyForm 
            property={selectedProperty}
            onSubmit={handleUpdateProperty}
            onCancel={() => {
              setSelectedProperty(null);
              setView('properties');
            }}
          />
        ) : null;
      case 'property-details':
        return selectedProperty ? (
          <PropertyDetails 
            property={selectedProperty}
            transactions={transactions.filter(t => t.propertyId === selectedProperty.id)}
            onBack={() => {
              setSelectedProperty(null);
              setView('properties');
            }}
            onEdit={() => handleEditProperty(selectedProperty)}
            onDelete={() => handleDeleteProperty(selectedProperty.id)}
            onAddTransaction={() => setShowTransactionForm(true)}
            onDeleteTransaction={handleDeleteTransaction}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        currentView={view}
        onNavigate={setView}
        alertCount={stats.expiringContracts.length}
        onShowAlerts={() => setShowAlerts(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>

      {showTransactionForm && selectedProperty && (
        <TransactionForm
          propertyId={selectedProperty.id}
          propertyName={`${selectedProperty.name} - ${selectedProperty.unit}`}
          onSubmit={handleAddTransaction}
          onClose={() => setShowTransactionForm(false)}
        />
      )}

      {showAlerts && (
        <AlertsPanel
          properties={stats.expiringContracts}
          onClose={() => setShowAlerts(false)}
          onViewProperty={(property) => {
            setShowAlerts(false);
            handleViewProperty(property);
          }}
        />
      )}
    </div>
  );
}

export default App;
