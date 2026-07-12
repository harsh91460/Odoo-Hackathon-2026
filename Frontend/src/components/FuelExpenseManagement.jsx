import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Fuel, DollarSign, Plus, Search, X, Check, AlertCircle, Info, Calendar, TrendingUp
} from 'lucide-react';

const FuelExpenseManagement = () => {
  const { expenses, fuelLogs, vehicles, addFuelLog, addExpense } = useData();
  const { user } = useAuth();

  // Financial Analyst or Fleet Manager has write access
  const canEdit = user?.role === 'Financial Analyst' || user?.role === 'Fleet Manager';

  // UI state
  const [tab, setTab] = useState('expenses'); // 'expenses' or 'fuel'
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [expenseTypeFilter, setExpenseTypeFilter] = useState('All');
  
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [error, setError] = useState('');

  // Expense form fields
  const [expVehicleId, setExpVehicleId] = useState('');
  const [expType, setExpType] = useState('Toll');
  const [expCost, setExpCost] = useState('');
  const [expDate, setExpDate] = useState('');
  const [expDescription, setExpDescription] = useState('');

  // Fuel form fields
  const [fuelVehicleId, setFuelVehicleId] = useState('');
  const [fuelLiters, setFuelLiters] = useState('');
  const [fuelCost, setFuelCost] = useState('');
  const [fuelDate, setFuelDate] = useState('');

  const eligibleVehicles = vehicles.filter(v => v.status !== 'Retired');

  const openExpenseModal = () => {
    setError('');
    setExpVehicleId(eligibleVehicles[0]?.id || '');
    setExpType('Toll');
    setExpCost('');
    setExpDate(new Date().toISOString().split('T')[0]);
    setExpDescription('');
    setIsExpenseModalOpen(true);
  };

  const openFuelModal = () => {
    setError('');
    setFuelVehicleId(eligibleVehicles[0]?.id || '');
    setFuelLiters('');
    setFuelCost('');
    setFuelDate(new Date().toISOString().split('T')[0]);
    setIsFuelModalOpen(true);
  };

  const handleSubmitExpense = (e) => {
    e.preventDefault();
    setError('');

    if (!expVehicleId || !expType || !expCost || !expDate || !expDescription) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      addExpense({
        vehicleId: expVehicleId,
        type: expType,
        cost: Number(expCost),
        date: expDate,
        description: expDescription.trim()
      });
      setIsExpenseModalOpen(false);
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };

  const handleSubmitFuel = (e) => {
    e.preventDefault();
    setError('');

    if (!fuelVehicleId || !fuelLiters || !fuelCost || !fuelDate) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      addFuelLog({
        vehicleId: fuelVehicleId,
        liters: Number(fuelLiters),
        cost: Number(fuelCost),
        date: fuelDate
      });
      setIsFuelModalOpen(false);
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };

  // Filtered lists
  const filteredExpenses = expenses.filter(e => {
    const vehicle = vehicles.find(v => v.id === e.vehicleId);
    const matchesSearch = e.description.toLowerCase().includes(search.toLowerCase()) || 
                          e.type.toLowerCase().includes(search.toLowerCase()) ||
                          (vehicle && vehicle.name.toLowerCase().includes(search.toLowerCase())) ||
                          (vehicle && vehicle.regNo.toLowerCase().includes(search.toLowerCase()));
    const matchesVehicle = vehicleFilter === 'All' || e.vehicleId === vehicleFilter;
    const matchesType = expenseTypeFilter === 'All' || e.type === expenseTypeFilter;
    return matchesSearch && matchesVehicle && matchesType;
  });

  const filteredFuelLogs = fuelLogs.filter(f => {
    const vehicle = vehicles.find(v => v.id === f.vehicleId);
    const matchesSearch = vehicle && (vehicle.name.toLowerCase().includes(search.toLowerCase()) || 
                                       vehicle.regNo.toLowerCase().includes(search.toLowerCase()));
    const matchesVehicle = vehicleFilter === 'All' || f.vehicleId === vehicleFilter;
    return (matchesSearch || search === '') && matchesVehicle;
  });

  // KPI calculations
  const totalExpenseCost = filteredExpenses.reduce((sum, e) => sum + e.cost, 0);
  const totalFuelLiters = filteredFuelLogs.reduce((sum, f) => sum + f.liters, 0);
  const totalFuelCost = filteredFuelLogs.reduce((sum, f) => sum + f.cost, 0);

  return (
    <div className="space-y-6">
      {/* Access banner and Header */}
      <div className="flex flex-col gap-4">
        {!canEdit && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
            <Info className="h-4.5 w-4.5 shrink-0" />
            <p><strong>Read-Only Mode:</strong> Only users with the <strong>Financial Analyst</strong> or <strong>Fleet Manager</strong> role can log expenses and fuel purchases.</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Fuel & Expense Logbook</h2>
            <p className="text-xs text-slate-400">Track fuel purchases, tolls, servicing, and compute total cost of ownership</p>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && (
              <>
                <button
                  onClick={openFuelModal}
                  className="flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 hover:text-indigo-600 hover:border-indigo-500/30 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                >
                  <Fuel className="h-4 w-4 text-indigo-600" />
                  Log Fuel
                </button>
                <button
                  onClick={openExpenseModal}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Log Expense
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white/30 p-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Gross Expenses</span>
            <h4 className="text-xl font-extrabold text-slate-900 mt-1">${totalExpenseCost.toLocaleString()}</h4>
          </div>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/30 p-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Fuel Cost logged</span>
            <h4 className="text-xl font-extrabold text-slate-900 mt-1">${totalFuelCost.toLocaleString()}</h4>
          </div>
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Fuel className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/30 p-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Fuel Liters Logged</span>
            <h4 className="text-xl font-extrabold text-slate-900 mt-1">{totalFuelLiters.toLocaleString()} L</h4>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => { setTab('expenses'); setSearch(''); }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            tab === 'expenses' ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          General Expense Records
        </button>
        <button
          onClick={() => { setTab('fuel'); setSearch(''); }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            tab === 'fuel' ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Fuel Log Sheets
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder={tab === 'expenses' ? "Search expenses..." : "Search by vehicle name/reg..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-9 text-xs text-slate-800 placeholder-slate-400 outline-none ring-1 ring-transparent transition-all focus:border-indigo-600 focus:ring-indigo-100"
          />
        </div>

        <select
          value={vehicleFilter}
          onChange={(e) => setVehicleFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
        >
          <option value="All">All Vehicles</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.name} ({v.regNo})</option>
          ))}
        </select>

        {tab === 'expenses' && (
          <select
            value={expenseTypeFilter}
            onChange={(e) => setExpenseTypeFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
          >
            <option value="All">All Expense Types</option>
            <option value="Fuel">Fuel</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Toll">Toll</option>
            <option value="Insurance">Insurance</option>
            <option value="Other">Other</option>
          </select>
        )}
      </div>

      {/* Table view */}
      {tab === 'expenses' ? (
        filteredExpenses.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-xl">
            <DollarSign className="h-12 w-12 text-slate-700 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">No expenses found</p>
          </div>
        ) : (
          <div className="bg-white/40 border border-slate-200 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/20 text-slate-400 font-semibold">
                    <th className="p-4">Date</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  {filteredExpenses.map(e => {
                    const vehicle = vehicles.find(v => v.id === e.vehicleId);
                    return (
                      <tr key={e.id} className="hover:bg-white/10">
                        <td className="p-4 font-mono">{e.date}</td>
                        <td className="p-4">
                          <span className="font-bold text-slate-900">{vehicle ? vehicle.name : 'Unknown'}</span>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{vehicle?.regNo}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            e.type === 'Fuel' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
                            e.type === 'Maintenance' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            e.type === 'Toll' ? 'bg-violet-50 text-violet-700 border border-violet-200' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {e.type}
                          </span>
                        </td>
                        <td className="p-4 max-w-xs truncate">{e.description}</td>
                        <td className="p-4 text-right font-bold text-rose-400 font-mono">${e.cost.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        filteredFuelLogs.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-xl">
            <Fuel className="h-12 w-12 text-slate-700 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">No fuel logs found</p>
          </div>
        ) : (
          <div className="bg-white/40 border border-slate-200 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/20 text-slate-400 font-semibold">
                    <th className="p-4">Date</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Liters</th>
                    <th className="p-4 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  {filteredFuelLogs.map(f => {
                    const vehicle = vehicles.find(v => v.id === f.vehicleId);
                    return (
                      <tr key={f.id} className="hover:bg-white/10">
                        <td className="p-4 font-mono">{f.date}</td>
                        <td className="p-4">
                          <span className="font-bold text-slate-900">{vehicle ? vehicle.name : 'Unknown'}</span>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{vehicle?.regNo}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-700">{f.liters} L</td>
                        <td className="p-4 text-right font-bold text-emerald-700 font-mono">${f.cost.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Log Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsExpenseModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-4">Log Fleet Expense</h3>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 mb-4">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmitExpense} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Select Vehicle</label>
                <select
                  required
                  value={expVehicleId}
                  onChange={(e) => setExpVehicleId(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500"
                >
                  <option value="" disabled>Select vehicle</option>
                  {eligibleVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.regNo})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Expense Type</label>
                  <select
                    required
                    value={expType}
                    onChange={(e) => setExpType(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500"
                  >
                    <option value="Toll">Toll</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Cost ($)</label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      required
                      value={expCost}
                      onChange={(e) => setExpCost(e.target.value)}
                      placeholder="e.g. 75"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-650 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Billing Date</label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input
                    type="date"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Expense Description</label>
                <textarea
                  required
                  rows="2"
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  placeholder="Invoice details, receipt number, description..."
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 placeholder-slate-600 outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-semibold text-slate-900 shadow-lg transition-all cursor-pointer hover:from-indigo-600 hover:to-violet-600"
                >
                  <Check className="h-4 w-4" />
                  Log Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Fuel Modal */}
      {isFuelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsFuelModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-4">Log Fuel Purchase</h3>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 mb-4">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmitFuel} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Select Vehicle</label>
                <select
                  required
                  value={fuelVehicleId}
                  onChange={(e) => setFuelVehicleId(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500"
                >
                  <option value="" disabled>Select vehicle</option>
                  {eligibleVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.regNo})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Volume (Liters)</label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Fuel className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      required
                      value={fuelLiters}
                      onChange={(e) => setFuelLiters(e.target.value)}
                      placeholder="e.g. 50"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-650 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Cost ($)</label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      required
                      value={fuelCost}
                      onChange={(e) => setFuelCost(e.target.value)}
                      placeholder="e.g. 70"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-650 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Purchase Date</label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input
                    type="date"
                    required
                    value={fuelDate}
                    onChange={(e) => setFuelDate(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFuelModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-semibold text-slate-900 shadow-lg transition-all cursor-pointer hover:from-indigo-600 hover:to-violet-600"
                >
                  <Check className="h-4 w-4" />
                  Log Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelExpenseManagement;
