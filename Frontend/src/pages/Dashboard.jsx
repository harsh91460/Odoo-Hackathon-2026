import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, Shield, Compass, LayoutDashboard, Car, Users, Wrench, Fuel, BarChart3, Sliders, Menu, X 
} from 'lucide-react';

// Import subcomponents
import DashboardOverview from '../components/DashboardOverview';
import VehicleRegistry from '../components/VehicleRegistry';
import DriverManagement from '../components/DriverManagement';
import TripDispatcher from '../components/TripDispatcher';
import MaintenanceWorkflow from '../components/MaintenanceWorkflow';
import FuelExpenseManagement from '../components/FuelExpenseManagement';
import ReportsAnalytics from '../components/ReportsAnalytics';
import SettingsRBAC from '../components/SettingsRBAC';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Vehicle Registry', icon: Car },
    { id: 'drivers', label: 'Driver Management', icon: Users },
    { id: 'trips', label: 'Trip Dispatcher', icon: Compass },
    { id: 'maintenance', label: 'Maintenance Log', icon: Wrench },
    { id: 'expenses', label: 'Fuel & Expenses', icon: Fuel },
    { id: 'reports', label: 'Reports & ROI', icon: BarChart3 },
    { id: 'settings', label: 'Settings & RBAC', icon: Sliders },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'vehicles':
        return <VehicleRegistry />;
      case 'drivers':
        return <DriverManagement />;
      case 'trips':
        return <TripDispatcher />;
      case 'maintenance':
        return <MaintenanceWorkflow />;
      case 'expenses':
        return <FuelExpenseManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <SettingsRBAC />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      {/* Mobile Header Banner */}
      <header className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-50 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-indigo-600 " />
          <span className="font-extrabold text-lg tracking-tight text-indigo-900">
            TransitOps
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Sidebar Layout */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/60 border-r border-slate-200 backdrop-blur-xl transition-transform duration-300 md:translate-x-0 md:static md:h-screen md:flex md:flex-col ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header Title */}
        <div className="hidden md:flex h-16 items-center px-6 gap-2.5 border-b border-slate-200">
          <Compass className="h-6 w-6 text-indigo-600 " />
          <span className="font-extrabold text-xl tracking-tight text-indigo-900">
            TransitOps
          </span>
        </div>

        {/* Sidebar Logged User info */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-100 shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || 'TO'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
              <div className="flex items-center gap-1 mt-1 text-[10px] bg-white/80 px-2 py-0.5 rounded-lg border border-slate-200 text-slate-600 w-fit">
                <Shield className="h-3 w-3 text-indigo-600 shrink-0" />
                <span className="font-semibold truncate">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                    : 'text-slate-400 hover:text-slate-900 hover:bg-white/30 border border-transparent'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                }`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer sign out */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-red-50 hover:border-red-200 hover:text-red-600 py-2.5 text-xs font-semibold text-slate-400 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out Operations
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background Ambient Glow */}
        
        

        {/* Top bar for dashboard desktop view */}
        <header className="hidden md:flex h-16 items-center justify-end px-8 border-b border-slate-200 bg-slate-50/10 backdrop-blur-sm z-30 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Ops Room</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 "></span>
          </div>
        </header>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderActiveComponent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
