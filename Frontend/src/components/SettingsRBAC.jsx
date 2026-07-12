import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, Settings, Check, Sliders 
} from 'lucide-react';

const SettingsRBAC = () => {
  const { user, simulateRole } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');

  // Local settings (simulated)
  const [safetyThreshold, setSafetyThreshold] = useState(() => localStorage.getItem('cfg_safety_threshold') || '70');
  const [revPerKm, setRevPerKm] = useState(() => localStorage.getItem('cfg_rev_per_km') || '3.50');
  const [warnDays, setWarnDays] = useState(() => localStorage.getItem('cfg_warn_days') || '30');

  const handleSaveConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('cfg_safety_threshold', safetyThreshold);
    localStorage.setItem('cfg_rev_per_km', revPerKm);
    localStorage.setItem('cfg_warn_days', warnDays);
    
    setSuccessMsg('System configuration saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleRoleSwap = (role) => {
    simulateRole(role);
    setSuccessMsg(`Simulated role swapped to: ${role}`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const rolesList = ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'];

  const rbacMatrix = [
    { module: 'Dashboard KPIs', manager: 'Full Access', driver: 'Read Only', officer: 'Read Only', analyst: 'Read Only' },
    { module: 'Vehicle Registry', manager: 'Full Access', driver: 'Read Only', officer: 'No Access', analyst: 'No Access' },
    { module: 'Driver Profiles', manager: 'Full Access', driver: 'No Access', officer: 'Full Access', analyst: 'No Access' },
    { module: 'Trip Dispatcher', manager: 'Full Access', driver: 'Full Access', officer: 'No Access', analyst: 'No Access' },
    { module: 'Maintenance Log', manager: 'Full Access', driver: 'No Access', officer: 'No Access', analyst: 'No Access' },
    { module: 'Fuel & Expenses', manager: 'Full Access', driver: 'No Access', officer: 'No Access', analyst: 'Full Access' },
    { module: 'Reports & Analytics', manager: 'Full Access', driver: 'No Access', officer: 'No Access', analyst: 'Full Access' },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">RBAC & Platform Settings</h2>
          <p className="text-xs text-slate-400">Simulate different user profiles and tune system parameters</p>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700">
          <Check className="h-4.5 w-4.5 shrink-0" />
          <p className="font-semibold">{successMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Role simulator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Swapping Cards */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Sliders className="h-5 w-5 text-indigo-600" />
              Role simulator controller
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Test role-based access rules without re-registering. Choose a profile below to immediately change dashboard controls, menu visibility, and write permissions.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {rolesList.map(r => {
                const isActive = user?.role === r;
                return (
                  <button
                    key={r}
                    onClick={() => handleRoleSwap(r)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between h-28 cursor-pointer relative overflow-hidden group ${
                      isActive 
                        ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500/50 shadow-indigo-500/10' 
                        : 'border-slate-200 bg-slate-50/20 hover:border-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500 text-slate-900 flex items-center justify-center rounded-bl-xl">
                        <Check className="h-4.5 w-4.5" />
                      </div>
                    )}
                    <span className={`text-xs font-extrabold uppercase tracking-wider ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}>{r}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        {r === 'Fleet Manager' ? 'Operations Lead' : 
                         r === 'Driver' ? 'Delivery Agent' : 
                         r === 'Safety Officer' ? 'Compliance Lead' : 
                         'Financial Analyst'}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                        {r === 'Fleet Manager' ? 'Manage full assets, shops, reports, and dispatcher.' :
                         r === 'Driver' ? 'View/log trips, register odometer, update statuses.' :
                         r === 'Safety Officer' ? 'Enforce licensing compliance and driver safety scores.' :
                         'Control fuel sheets, costs, ROI, and export data.'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matrix table */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">RBAC Permission Matrix</h3>
            <p className="text-xs text-slate-500 mb-4">Official role authorization rules defined by problem statement</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/20 text-slate-400 font-semibold">
                    <th className="p-3">Module Name</th>
                    <th className="p-3">Fleet Manager</th>
                    <th className="p-3">Safety Officer</th>
                    <th className="p-3">Financial Analyst</th>
                    <th className="p-3">Driver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  {rbacMatrix.map((m, i) => (
                    <tr key={i} className="hover:bg-white/10">
                      <td className="p-3 font-semibold text-slate-900">{m.module}</td>
                      <td className="p-3 font-medium text-emerald-700">{m.manager}</td>
                      <td className="p-3">
                        <span className={m.officer === 'Full Access' ? 'text-emerald-700 font-medium' : m.officer === 'Read Only' ? 'text-indigo-600' : 'text-slate-600'}>
                          {m.officer}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={m.analyst === 'Full Access' ? 'text-emerald-700 font-medium' : m.analyst === 'Read Only' ? 'text-indigo-600' : 'text-slate-600'}>
                          {m.analyst}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={m.driver === 'Full Access' ? 'text-emerald-700 font-medium' : m.driver === 'Read Only' ? 'text-indigo-600' : 'text-slate-600'}>
                          {m.driver}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column: defaults settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-600" />
              Operational Constants
            </h3>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Minimum Driver Safety Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={safetyThreshold}
                  onChange={(e) => setSafetyThreshold(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 placeholder-slate-600 outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Flag alerts if driver safety rating drops below this value.</p>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Est Revenue Rate per km ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={revPerKm}
                  onChange={(e) => setRevPerKm(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 placeholder-slate-650 outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Default rate to compute planned trip revenues (Revenue = Distance * Rate).</p>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Expiry Alert Buffer (Days)</label>
                <input
                  type="number"
                  value={warnDays}
                  onChange={(e) => setWarnDays(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 placeholder-slate-650 outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Flag license warnings when expiring within this number of days.</p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="w-full justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-semibold text-white shadow-md outline-none transition-all focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </form>

            <div className="mt-8 border-t border-slate-200 pt-4 flex gap-2.5 items-start bg-slate-50/20 p-3.5 rounded-xl border border-slate-200 text-[10px] text-slate-500 leading-relaxed">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-amber-500 mt-0.5" />
              <div>
                <span className="font-bold text-slate-700 block mb-0.5">Admin Security Control</span>
                To reset all database values, purge your browser cache or run <code>localStorage.clear()</code> in the browser console.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsRBAC;
