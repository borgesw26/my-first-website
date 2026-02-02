import { Building2, Users, Home, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { Property, Transaction, DashboardStats } from '../types';
import { formatCurrency, getDaysUntilExpiration, getStatusLabel, getStatusColor } from '../utils/helpers';

interface DashboardProps {
  stats: DashboardStats;
  properties: Property[];
  transactions: Transaction[];
  onViewProperty: (property: Property) => void;
  onShowAlerts: () => void;
}

export default function Dashboard({ stats, properties, onViewProperty, onShowAlerts }: DashboardProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Building2 className="w-6 h-6" />}
          label="Total de Imóveis"
          value={stats.totalProperties.toString()}
          color="blue"
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Alugados"
          value={stats.occupiedProperties.toString()}
          subtext={`${stats.vacantProperties} vagos`}
          color="green"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Receita Mensal"
          value={formatCurrency(stats.totalMonthlyIncome)}
          color="emerald"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          label="Patrimônio Total"
          value={formatCurrency(stats.totalPropertyValue)}
          color="violet"
        />
      </div>

      {/* Alerts Section */}
      {stats.expiringContracts.length > 0 && (
        <div 
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={onShowAlerts}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-900">
                Contratos Vencendo em Breve
              </h3>
              <p className="text-amber-700 mt-1">
                {stats.expiringContracts.length} contrato(s) vencem nos próximos 90 dias.
                Clique para ver detalhes.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {stats.expiringContracts.slice(0, 3).map(property => {
                  const days = getDaysUntilExpiration(property.endDate);
                  return (
                    <span 
                      key={property.id}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        days <= 30 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {property.name} {property.unit} - {days} dias
                    </span>
                  );
                })}
                {stats.expiringContracts.length > 3 && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-600">
                    +{stats.expiringContracts.length - 3} mais
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Properties Overview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Visão Geral dos Imóveis</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Imóvel
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Valor do Imóvel
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Aluguel
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Inquilino
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {properties.map((property) => (
                <tr 
                  key={property.id}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => onViewProperty(property)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Home className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {property.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          Unidade {property.unit}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                    {formatCurrency(property.propertyValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">
                      {formatCurrency(property.rentValue)}
                    </div>
                    <div className="text-sm text-slate-500">
                      Líquido: {formatCurrency(property.netValue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                    {property.tenant || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {getStatusLabel(property.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
  color: 'blue' | 'green' | 'emerald' | 'violet';
}

function StatCard({ icon, label, value, subtext, color }: StatCardProps) {
  const iconBgClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    violet: 'bg-violet-100 text-violet-600',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        {subtext && (
          <p className="text-sm text-slate-500 mt-1">{subtext}</p>
        )}
      </div>
    </div>
  );
}
