import { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Car, CheckCircle2, AlertTriangle, Play, 
  User, TrendingUp, RefreshCw
} from 'lucide-react';

const DashboardOverview = () => {
  const { vehicles, drivers, trips, maintenance, expenses } = useData();
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');

  // Filter vehicles for KPI calculations (or apply filters if selected)
  const filteredVehiclesForKPI = vehicles.filter(v => {
    const matchType = vehicleTypeFilter === 'All' || v.type === vehicleTypeFilter;
    const matchRegion = regionFilter === 'All' || v.region === regionFilter;
    return matchType && matchRegion;
  });

  const totalVehicles = filteredVehiclesForKPI.length;
  const activeVehicles = filteredVehiclesForKPI.filter(v => v.status === 'On Trip').length;
  const availableVehicles = filteredVehiclesForKPI.filter(v => v.status === 'Available').length;
  const inShopVehicles = filteredVehiclesForKPI.filter(v => v.status === 'In Shop').length;

  const activeTrips = trips.filter(t => t.status === 'Dispatched').length;
  const pendingTrips = trips.filter(t => t.status === 'Draft').length;
  
  // Drivers on duty
  const driversOnDuty = drivers.filter(d => d.status === 'Available' || d.status === 'On Trip').length;
  
  // Fleet utilization: (Active Vehicles / Total Non-Retired Vehicles) * 100
  const activeAndAvailable = filteredVehiclesForKPI.filter(v => v.status !== 'Retired').length;
  const fleetUtilization = activeAndAvailable > 0 
    ? Math.round((activeVehicles / activeAndAvailable) * 100) 
    : 0;

  // Alerts
  const alerts = [];
  
  // 1. Expired licenses
  drivers.forEach(d => {
    const isExpired = new Date(d.expiryDate) < new Date();
    if (isExpired) {
      alerts.push({
        id: `alert-d-${d.id}`,
        type: 'error',
        message: `Driver license expired for ${d.name} (${d.licenseNo})`,
        category: 'Driver Compliance'
      });
    } else {
      // expiring within 30 days
      const diffTime = new Date(d.expiryDate) - new Date();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 30 && diffDays > 0) {
        alerts.push({
          id: `alert-d-warn-${d.id}`,
          type: 'warning',
          message: `Driver license for ${d.name} expires in ${diffDays} days`,
          category: 'Driver Compliance'
        });
      }
    }
    if (d.status === 'Suspended') {
      alerts.push({
        id: `alert-d-susp-${d.id}`,
        type: 'warning',
        message: `Driver ${d.name} is currently suspended`,
        category: 'Driver Status'
      });
    }
  });

  // 2. Active maintenance logs
  maintenance.forEach(m => {
    if (m.status === 'Active') {
      const v = vehicles.find(veh => veh.id === m.vehicleId);
      alerts.push({
        id: `alert-m-${m.id}`,
        type: 'info',
        message: `Vehicle ${v ? v.regNo : 'Unknown'} is In Shop for: ${m.serviceType}`,
        category: 'Maintenance'
      });
    }
  });

  // Get distinct vehicle types
  const vehicleTypes = ['All', ...new Set(vehicles.map(v => v.type))];
  const regions = ['All', 'North', 'South', 'East', 'West'];

  // Calculate some simple operational stats
  const totalExpenses = expenses.reduce((sum, e) => sum + e.cost, 0);
  const totalRevenue = vehicles.reduce((sum, v) => sum + (v.revenue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Operations Dashboard</h2>
          <p className="text-xs text-slate-400">Real-time status overview and KPIs</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Type:</span>
            <select
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
            >
              {vehicleTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Region:</span>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
            >
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="relative overflow-hidden bg-white p-5 rounded-xl border border-slate-200 shadow-sm group hover:border-indigo-500/50 transition-all duration-300">
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Vehicles</p>
              <h3 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">{totalVehicles}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Car className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex gap-3 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>{availableVehicles} Avail</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"></span>{activeVehicles} Trip</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>{inShopVehicles} Shop</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative overflow-hidden bg-white p-5 rounded-xl border border-slate-200 shadow-sm group hover:border-emerald-500/50 transition-all duration-300">
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fleet Utilization</p>
              <h3 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">{fleetUtilization}%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-700" />
            <span>Optimal rate: 70% - 90%</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative overflow-hidden bg-white p-5 rounded-xl border border-slate-200 shadow-sm group hover:border-violet-500/50 transition-all duration-300">
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Dispatch</p>
              <h3 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">{activeTrips}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-violet-50 text-violet-700 border border-violet-200">
              <Play className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex gap-3 text-[11px] text-slate-400 font-medium">
            <span className="text-violet-700 font-bold">{pendingTrips} Draft trips pending</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="relative overflow-hidden bg-white p-5 rounded-xl border border-slate-200 shadow-sm group hover:border-amber-500/50 transition-all duration-300">
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Drivers Duty</p>
              <h3 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">{driversOnDuty}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <User className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 text-[11px] text-slate-400 flex items-center gap-1">
            <span>Total registered: {drivers.length} drivers</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Alerts & Charts / Mini Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Dynamic Activity & Visual charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Custom SVG Trend Graph */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Financial Summary</h3>
                <p className="text-xs text-slate-400">Total Revenue vs Operational Cost</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block"></span>Revenue: ${totalRevenue.toLocaleString()}</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block"></span>Expenses: ${totalExpenses.toLocaleString()}</span>
              </div>
            </div>
            
            {/* SVG Chart */}
            <div className="h-48 w-full bg-slate-50/40 rounded-xl border border-slate-200 relative p-4 flex items-end">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                <line x1="0" y1="10" x2="100" y2="10" stroke="#e2e8f0" strokeWidth="0.1" />
                <line x1="0" y1="20" x2="100" y2="20" stroke="#e2e8f0" strokeWidth="0.1" />
                <line x1="0" y1="30" x2="100" y2="30" stroke="#e2e8f0" strokeWidth="0.1" />
                
                {/* Revenue Curve */}
                <path d="M 0 35 Q 20 20 40 28 T 80 12 T 100 8 L 100 40 L 0 40 Z" fill="url(#revenueGrad)" />
                <path d="M 0 35 Q 20 20 40 28 T 80 12 T 100 8" fill="none" stroke="#6366f1" strokeWidth="1.5" />
                
                {/* Expense Curve */}
                <path d="M 0 38 Q 25 32 50 34 T 75 25 T 100 22 L 100 40 L 0 40 Z" fill="url(#expenseGrad)" />
                <path d="M 0 38 Q 25 32 50 34 T 75 25 T 100 22" fill="none" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="1 0.5" />
              </svg>
              
              <div className="absolute inset-0 flex justify-between px-6 pt-16 pointer-events-none">
                <span className="text-[10px] text-slate-400 font-bold">Jan</span>
                <span className="text-[10px] text-slate-400 font-bold">Mar</span>
                <span className="text-[10px] text-slate-400 font-bold">May</span>
                <span className="text-[10px] text-slate-400 font-bold">Jul (Current)</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400">Gross Margin</span>
                <p className="text-sm font-bold text-emerald-700 mt-1">
                  +{totalRevenue > 0 ? Math.round(((totalRevenue - totalExpenses) / totalRevenue) * 100) : 0}%
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400">Fuel Cost Ratio</span>
                <p className="text-sm font-bold text-indigo-600 mt-1">
                  {totalExpenses > 0 ? Math.round((expenses.filter(e => e.type === 'Fuel').reduce((s, e) => s + e.cost, 0) / totalExpenses) * 100) : 0}%
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400">Avg Maintenance</span>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  ${vehicles.length > 0 ? Math.round(expenses.filter(e => e.type === 'Maintenance').reduce((s, e) => s + e.cost, 0) / vehicles.length) : 0}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Vehicle Status List */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Active Fleet Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                    <th className="py-2.5">Vehicle</th>
                    <th className="py-2.5">Type</th>
                    <th className="py-2.5">Region</th>
                    <th className="py-2.5">Odometer</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {vehicles.slice(0, 4).map(v => (
                    <tr key={v.id} className="hover:bg-white/20 text-slate-700">
                      <td className="py-3 font-semibold text-slate-900">
                        <div>{v.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{v.regNo}</div>
                      </td>
                      <td className="py-3">{v.type}</td>
                      <td className="py-3">{v.region}</td>
                      <td className="py-3 font-mono">{v.odometer.toLocaleString()} km</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          v.status === 'On Trip' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
                          v.status === 'In Shop' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${
                            v.status === 'Available' ? 'bg-emerald-400' :
                            v.status === 'On Trip' ? 'bg-indigo-400' :
                            v.status === 'In Shop' ? 'bg-amber-400' :
                            'bg-slate-500'
                          }`}></span>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Alerts Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-700" />
                Compliance & Alerts
              </h3>
              <span className="bg-slate-800 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                {alerts.length} Active
              </span>
            </div>

            {alerts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500/40 mb-3" />
                <p className="text-xs text-slate-500 font-medium">All systems green.</p>
                <p className="text-[10px] text-slate-400">No active violations or warnings found.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {alerts.map(a => (
                  <div 
                    key={a.id} 
                    className={`p-3.5 rounded-xl border text-xs flex gap-2.5 transition-all ${
                      a.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
                      a.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                      'bg-white/60 border-slate-200 text-slate-700'
                    }`}
                  >
                    <AlertTriangle className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${
                      a.type === 'error' ? 'text-red-600' :
                      a.type === 'warning' ? 'text-amber-700' :
                      'text-indigo-600'
                    }`} />
                    <div className="space-y-0.5">
                      <div className="font-semibold text-[10px] tracking-wider uppercase opacity-80">{a.category}</div>
                      <p className="leading-relaxed">{a.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-t border-slate-200 mt-6 pt-4 text-center">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                <RefreshCw className="h-3 w-3 " />
                Auto-updating from registry logs
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;
