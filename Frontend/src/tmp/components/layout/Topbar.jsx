import { Search, Bell } from 'lucide-react';

export default function Topbar({ pageTitle }) {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-8 shrink-0">
      <h2 className="text-xl font-semibold text-white">{pageTitle}</h2>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-panel border border-border rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary w-64 text-white placeholder-gray-500"
          />
        </div>
        
        <button className="text-gray-400 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-status-red w-2 h-2 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-border pl-6">
          <span className="text-sm font-medium text-gray-200">Dispatcher RK</span>
          <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold">
            RK
          </div>
        </div>
      </div>
    </header>
  );
}