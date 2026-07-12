import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Wrench, Plus, CheckCircle2, Search, X, Check, AlertCircle, Info, Calendar, DollarSign, FileText
} from 'lucide-react';

const MaintenanceWorkflow = () => {
  const { maintenance, vehicles, addMaintenance, closeMaintenance } = useData();
  const { user } = useAuth();

  // Only Fleet Manager can log maintenance
  const isManager = user?.role === 'Fleet Manager';

  // UI state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [activeMaintForClosure, setActiveMaintForClosure] = useState(null);
  
  // Close form fields
  const [closureCost, setClosureCost] = useState('');
  const [closureEndDate, setClosureEndDate] = useState('');
  const [error, setError] = useState('');

  // Maintenance Form fields
  const [vehicleId, setVehicleId] = useState('');
  const [serviceType, setServiceType] = useState('Oil Change');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [startDate, setStartDate] = useState('');

  // Eligible vehicles (not on trip, not retired)
  const eligibleVehicles = vehicles.filter(v => v.status !== 'Retired' && v.status !== 'On Trip');

  const openAddModal = () => {
    setError('');
    setVehicleId(eligibleVehicles[0]?.id || '');
    setServiceType('Oil Change');
    setDescription('');
    setCost('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const openCloseModal = (maint) => {
    setError('');
    setActiveMaintForClosure(maint);
    setClosureCost(maint.cost.toString());
    setClosureEndDate(new Date().toISOString().split('T')[0]);
    setIsCloseModalOpen(true);
  };

  const handleSubmitMaintenance = (e) => {
    e.preventDefault();
    setError('');

    if (!vehicleId || !serviceType || !description || !cost || !startDate) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      addMaintenance({
        vehicleId,
        serviceType,
        description: description.trim(),
        cost: Number(cost),
        startDate
      });
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };

  const handleCloseMaintSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!closureCost || !closureEndDate) {
      setError('Please fill in final cost and end date.');
      return;
    }

    try {
      closeMaintenance(activeMaintForClosure.id, {
        cost: Number(closureCost),
        endDate: closureEndDate
      });
      setIsCloseModalOpen(false);
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };

  // Filter logs
  const filteredMaint = maintenance.filter(m => {
    const vehicle = vehicles.find(v => v.id === m.vehicleId);
    const matchesSearch = m.serviceType.toLowerCase().includes(search.toLowerCase()) || 
                          m.description.toLowerCase().includes(search.toLowerCase()) ||
                          (vehicle && vehicle.name.toLowerCase().includes(search.toLowerCase())) ||
                          (vehicle && vehicle.regNo.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner and Access Banner */}
      <div className="flex flex-col gap-4">
        {!isManager && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
            <Info className="h-4.5 w-4.5 shrink-0" />
            <p><strong>Read-Only Mode:</strong> Only users with the <strong>Fleet Manager</strong> role can schedule maintenance or resolve workshop jobs.</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Workshop & Maintenance</h2>
            <p className="text-xs text-slate-400">Put vehicles in shop, track repairs, and log maintenance history</p>
          </div>
          {isManager && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Schedule Maintenance
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search logs by vehicle, description, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-9 text-xs text-slate-800 placeholder-slate-400 outline-none ring-1 ring-transparent transition-all focus:border-indigo-600 focus:ring-indigo-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
        >
          <option value="All">All Workshop Statuses</option>
          <option value="Active">Active (In Shop)</option>
          <option value="Closed">Closed (Completed)</option>
        </select>
      </div>

      {/* Maintenance Logs List */}
      {filteredMaint.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-xl">
          <Wrench className="h-12 w-12 text-slate-700 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-400">No maintenance records found</p>
          <p className="text-xs text-slate-400 mt-1">Add a vehicle to maintenance to log services.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMaint.map(m => {
            const vehicle = vehicles.find(v => v.id === m.vehicleId);

            return (
              <div 
                key={m.id} 
                className={`rounded-2xl border bg-white/40 p-5 backdrop-blur-md transition-all duration-300 hover:shadow-sm ${
                  m.status === 'Active' ? 'border-amber-200 bg-amber-500/5' : 'border-slate-200 hover:border-slate-200'
                }`}
              >
                {/* Status Indicator Bar */}
                <div className={`absolute top-0 left-0 w-full h-[3px] ${
                  m.status === 'Active' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></div>

                {/* Top row */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {m.serviceType}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Assigned to: {vehicle ? vehicle.name : 'Unknown Vehicle'}
                    </span>
                    <span className="text-[10px] text-indigo-600 font-mono tracking-wider ml-1">
                      ({vehicle?.regNo})
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    m.status === 'Active' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {m.status === 'Active' ? 'In Shop' : 'Completed'}
                  </span>
                </div>

                {/* Details */}
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/30 p-3 rounded-xl border border-slate-200 mb-4 flex gap-1.5 items-start">
                  <FileText className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                  <span>{m.description}</span>
                </p>

                {/* Info row */}
                <div className="grid grid-cols-3 gap-3 text-[11px] border-t border-slate-200 pt-3.5 mt-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Service Cost</span>
                    <p className="font-bold text-emerald-700 mt-0.5">${m.cost.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Start Date</span>
                    <p className="font-semibold text-slate-700 mt-0.5 font-mono">{m.startDate}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">End Date</span>
                    <p className="font-semibold text-slate-700 mt-0.5 font-mono">{m.endDate || 'In Progress'}</p>
                  </div>
                </div>

                {/* Action panel */}
                {isManager && m.status === 'Active' && (
                  <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-slate-200">
                    <button
                      onClick={() => openCloseModal(m)}
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-650 hover:bg-emerald-600 text-slate-900 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Complete Service
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Maintenance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-4">Schedule Maintenance Job</h3>

            {eligibleVehicles.length === 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs mb-4 space-y-1">
                <AlertCircle className="h-5 w-5 mb-1" />
                <p className="font-bold">No Eligible Vehicles</p>
                <p>There are no vehicles currently parked or available (not on trip) to put in the workshop.</p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 mb-4">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmitMaintenance} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Select Vehicle</label>
                  <select
                    required
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500"
                  >
                    <option value="" disabled>Select vehicle</option>
                    {eligibleVehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.regNo}) - Odo: {v.odometer}km
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Service Category</label>
                  <select
                    required
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500"
                  >
                    <option value="Oil Change">Oil Change</option>
                    <option value="Brake Inspection">Brake Inspection</option>
                    <option value="Engine Tune-up">Engine Tune-up</option>
                    <option value="Tire Replacement">Tire Replacement</option>
                    <option value="Electrical Repair">Electrical Repair</option>
                    <option value="Other Diagnostics">Other Diagnostics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Est Service Cost ($)</label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      required
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      placeholder="e.g. 250"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-650 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Shop Entry Date</label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Repair Notes & Description</label>
                <textarea
                  required
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide brief details about the issue or maintenance required..."
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 placeholder-slate-600 outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={eligibleVehicles.length === 0}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-semibold text-slate-900 shadow-lg transition-all cursor-pointer hover:from-indigo-600 hover:to-violet-600 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  Log to Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close Maintenance Modal */}
      {isCloseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCloseModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Complete Workshop Job</h3>
            <p className="text-xs text-slate-400 mb-4">Complete maintenance, log final invoice cost, and release vehicle back to Available status.</p>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 mb-4">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleCloseMaintSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Final Invoice Cost ($)</label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <input
                    type="number"
                    required
                    value={closureCost}
                    onChange={(e) => setClosureCost(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-650 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Release Date</label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input
                    type="date"
                    required
                    value={closureEndDate}
                    onChange={(e) => setClosureEndDate(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCloseModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-650 hover:bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-slate-900 shadow-lg transition-all cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  Release Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceWorkflow;
