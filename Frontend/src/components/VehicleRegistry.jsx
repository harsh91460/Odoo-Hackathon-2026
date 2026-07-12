import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Car, Plus, Trash2, Edit3, Search, X, Check, Eye, AlertCircle, Info 
} from 'lucide-react';

const VehicleRegistry = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
  const { user } = useAuth();
  
  // RBAC checks
  const isManager = user?.role === 'Fleet Manager';

  // UI state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [error, setError] = useState('');

  // Form fields
  const [regNo, setRegNo] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('Van');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [odometer, setOdometer] = useState('');
  const [acquisitionCost, setAcquisitionCost] = useState('');
  const [status, setStatus] = useState('Available');
  const [region, setRegion] = useState('North');

  const openAddModal = () => {
    setError('');
    setEditingVehicle(null);
    setRegNo('');
    setName('');
    setType('Van');
    setMaxCapacity('');
    setOdometer('');
    setAcquisitionCost('');
    setStatus('Available');
    setRegion('North');
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setError('');
    setEditingVehicle(vehicle);
    setRegNo(vehicle.regNo);
    setName(vehicle.name);
    setType(vehicle.type);
    setMaxCapacity(vehicle.maxCapacity.toString());
    setOdometer(vehicle.odometer.toString());
    setAcquisitionCost(vehicle.acquisitionCost.toString());
    setStatus(vehicle.status);
    setRegion(vehicle.region || 'North');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!regNo || !name || !maxCapacity || !odometer || !acquisitionCost) {
      setError('Please fill in all required fields.');
      return;
    }

    const payload = {
      regNo: regNo.trim().toUpperCase(),
      name: name.trim(),
      type,
      maxCapacity: Number(maxCapacity),
      odometer: Number(odometer),
      acquisitionCost: Number(acquisitionCost),
      status,
      region
    };

    try {
      if (editingVehicle) {
        updateVehicle(editingVehicle.id, payload);
      } else {
        addVehicle(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };

  const handleDelete = (id, regNo) => {
    if (window.confirm(`Are you sure you want to delete vehicle ${regNo}?`)) {
      try {
        deleteVehicle(id);
      } catch (err) {
        alert(err.message || 'Failed to delete vehicle.');
      }
    }
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                          v.regNo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Read-Only Alert */}
      <div className="flex flex-col gap-4">
        {!isManager && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
            <Info className="h-4.5 w-4.5 shrink-0" />
            <p><strong>Read-Only Mode:</strong> Only users with the <strong>Fleet Manager</strong> role can add, modify, or delete vehicles.</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Vehicle Registry</h2>
            <p className="text-xs text-slate-400">Manage transportation fleet assets</p>
          </div>
          {isManager && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Register Vehicle
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name or reg number..."
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
          <option value="All">All Statuses</option>
          <option value="Available">Available</option>
          <option value="On Trip">On Trip</option>
          <option value="In Shop">In Shop</option>
          <option value="Retired">Retired</option>
        </select>
      </div>

      {/* Grid of Vehicles */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-xl">
          <Car className="h-12 w-12 text-slate-700 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-400">No vehicles found</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting the filters or adding a vehicle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVehicles.map(v => (
            <div 
              key={v.id} 
              className={`rounded-2xl border bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:border-slate-200 ${
                v.status === 'Retired' ? 'border-slate-200 opacity-60' : 'border-slate-200 hover:border-slate-200'
              }`}
            >
              {/* Top Row */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{v.name}</h3>
                  <span className="text-[10px] text-indigo-600 font-mono tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 mt-1 inline-block">
                    {v.regNo}
                  </span>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  v.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  v.status === 'On Trip' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
                  v.status === 'In Shop' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {v.status}
                </span>
              </div>

              {/* Vehicle Specs */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs border-t border-b border-slate-200 py-3.5 my-3.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Type</span>
                  <p className="font-semibold text-slate-700 mt-0.5">{v.type}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Region</span>
                  <p className="font-semibold text-slate-700 mt-0.5">{v.region || 'North'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Max Capacity</span>
                  <p className="font-semibold text-slate-700 mt-0.5">{v.maxCapacity.toLocaleString()} kg</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Odometer</span>
                  <p className="font-semibold text-slate-700 mt-0.5 font-mono">{v.odometer.toLocaleString()} km</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Acquisition Cost</span>
                  <p className="font-semibold text-slate-700 mt-0.5">${v.acquisitionCost.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Revenue</span>
                  <p className="font-semibold text-emerald-700 mt-0.5">${(v.revenue || 0).toLocaleString()}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-1.5">
                {isManager ? (
                  <>
                    <button
                      onClick={() => openEditModal(v)}
                      className="p-2 rounded-xl text-slate-500 bg-white border border-slate-200 hover:text-slate-900 hover:border-slate-200 transition-all cursor-pointer"
                      title="Edit Vehicle"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(v.id, v.regNo)}
                      className="p-2 rounded-xl text-slate-500 bg-white border border-slate-200 hover:text-red-600 hover:border-red-500/30 transition-all cursor-pointer"
                      title="Delete Vehicle"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openEditModal(v)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-400 bg-white border border-slate-200 hover:text-slate-900 transition-all text-[11px] cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingVehicle ? (isManager ? 'Modify Vehicle Details' : 'Vehicle Specifications') : 'Register New Fleet Vehicle'}
            </h3>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 mb-4">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Registration Number</label>
                  <input
                    type="text"
                    required
                    disabled={!isManager || editingVehicle}
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="e.g. TR-05-9011"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 placeholder-slate-600 outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Name / Model</label>
                  <input
                    type="text"
                    required
                    disabled={!isManager}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Volvo Heavy Truck"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 placeholder-slate-600 outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Vehicle Type</label>
                  <select
                    disabled={!isManager}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500 disabled:opacity-50"
                  >
                    <option value="Van">Van</option>
                    <option value="Heavy Truck">Heavy Truck</option>
                    <option value="Light Truck">Light Truck</option>
                    <option value="Sedan">Sedan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Operating Region</label>
                  <select
                    disabled={!isManager}
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500 disabled:opacity-50"
                  >
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Max Load (kg)</label>
                  <input
                    type="number"
                    required
                    disabled={!isManager}
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    placeholder="e.g. 1500"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 placeholder-slate-600 outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Odometer (km)</label>
                  <input
                    type="number"
                    required
                    disabled={!isManager}
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    placeholder="e.g. 45000"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 placeholder-slate-600 outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Acquisition Cost ($)</label>
                  <input
                    type="number"
                    required
                    disabled={!isManager}
                    value={acquisitionCost}
                    onChange={(e) => setAcquisitionCost(e.target.value)}
                    placeholder="e.g. 35000"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 placeholder-slate-600 outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Vehicle Status</label>
                <select
                  disabled={!isManager}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500 disabled:opacity-50"
                >
                  <option value="Available">Available</option>
                  <option value="On Trip">On Trip</option>
                  <option value="In Shop">In Shop</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  {isManager ? 'Cancel' : 'Close'}
                </button>
                {isManager && (
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-semibold text-slate-900 shadow-lg transition-all cursor-pointer hover:from-indigo-600 hover:to-violet-600"
                  >
                    <Check className="h-4 w-4" />
                    Save Vehicle
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleRegistry;
