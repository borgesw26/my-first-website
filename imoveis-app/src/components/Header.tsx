import { Building2, LayoutDashboard, List, Bell } from 'lucide-react';

type View = 'dashboard' | 'properties' | 'property-details' | 'add-property' | 'edit-property';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
  alertCount: number;
  onShowAlerts: () => void;
}

export default function Header({ currentView, onNavigate, alertCount, onShowAlerts }: HeaderProps) {
  const isActive = (views: View[]) => views.includes(currentView);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-900">ImóveisGestor</h1>
              <p className="text-xs text-slate-500 -mt-1">Sistema de Gestão</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive(['dashboard'])
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('properties')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive(['properties', 'property-details', 'add-property', 'edit-property'])
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <List className="w-5 h-5" />
              <span className="hidden sm:inline">Imóveis</span>
            </button>

            {/* Alerts Button */}
            <button
              onClick={onShowAlerts}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-all"
            >
              <Bell className="w-5 h-5" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {alertCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
