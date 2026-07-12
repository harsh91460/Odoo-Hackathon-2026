import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Plus, Trash2, Edit3, Search, X, Check, Eye, AlertCircle, Info, ShieldAlert 
} from 'lucide-react';

const DriverManagement = () => {
  const { drivers, addDriver, updateDriver, deleteDriver } = useData();
  const { user } = useAuth();

  // Safety Officer or Fleet Manager can edit
  const canEdit = user?.role === 'Safety Officer' || user?.role === 'Fleet Manager';

  // UI state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [category, setCategory] = useState('Class A');
  const [expiryDate, setExpiryDate] = useState('');
  const [contact, setContact] = useState('');
  const [safetyScore, setSafetyScore] = useState('');
  const [status, setStatus] = useState('Available');

  const openAddModal = () => {
    setError('');
    setEditingDriver(null);
    setName('');
    setLicenseNo('');
    setCategory('Class A');
    setExpiryDate('');
    setContact('');
    setSafetyScore('90');
    setStatus('Available');
    setIsModalOpen(true);
  };

  const openEditModal = (driver) => {
    setError('');
    setEditingDriver(driver);
    setName(driver.name);
    setLicenseNo(driver.licenseNo);
    setCategory(driver.category);
    setExpiryDate(driver.expiryDate);
    setContact(driver.contact);
    setSafetyScore(driver.safetyScore.toString());
    setStatus(driver.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !licenseNo || !expiryDate || !contact || !safetyScore) {
      setError('Please fill in all required fields.');
      return;
    }

    const payload = {
      name: name.trim(),
      licenseNo: licenseNo.trim().toUpperCase(),
      category,
      expiryDate,
      contact: contact.trim(),
      safetyScore: Number(safetyScore),
      status
    };

    try {
      if (editingDriver) {
        updateDriver(editingDriver.id, payload);
      } else {
        addDriver(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };

  const handleDelete = (id, driverName) => {
    if (window.confirm(`Are you sure you want to remove driver ${driverName}?`)) {
      try {
        deleteDriver(id);
      } catch (err) {
        alert(err.message || 'Failed to delete driver.');
      }
    }
  };

  // Filter drivers
  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                          d.licenseNo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Compliance Bar */}
      <div className="flex flex-col gap-4">
        {!canEdit && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
            <Info className="h-4.5 w-4.5 shrink-0" />
            <p><strong>Read-Only Mode:</strong> Only users with the <strong>Safety Officer</strong> or <strong>Fleet Manager</strong> role can edit driver records.</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Driver Management</h2>
            <p className="text-xs text-slate-400">Track licenses, safety metrics, and compliance</p>
          </div>
          {canEdit && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Driver Profile
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
            placeholder="Search by name or license number..."
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
          <option value="Off Duty">Off Duty</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Drivers List */}
      {filteredDrivers.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-xl">
          <Users className="h-12 w-12 text-slate-700 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-400">No driver records found</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting the filters or adding a new driver.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDrivers.map(d => {
            const isLicenseExpired = new Date(d.expiryDate) < new Date();
            const isCriticalSafety = d.safetyScore < 70;
            const isWarningSafety = d.safetyScore >= 70 && d.safetyScore < 85;

            return (
              <div 
                key={d.id} 
                className={`rounded-2xl border bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:border-slate-200 ${
                  isLicenseExpired ? 'border-red-500/30 bg-red-950/5' : 'border-slate-200 hover:border-slate-200'
                }`}
              >
                {/* Warning Glow for Expired License */}
                {isLicenseExpired && (
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500"></div>
                )}
                {d.status === 'Suspended' && (
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500"></div>
                )}

                {/* Top Row */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      {d.name}
                      {isLicenseExpired && (
                        <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" title="License Expired" />
                      )}
                    </h3>
                    <span className="text-[10px] text-indigo-600 font-mono tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 mt-1 inline-block">
                      License: {d.licenseNo}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    d.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    d.status === 'On Trip' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
                    d.status === 'Suspended' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {d.status}
                  </span>
                </div>

                {/* Driver Stats */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs border-t border-b border-slate-200 py-3.5 my-3.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">License Class</span>
                    <p className="font-semibold text-slate-700 mt-0.5">{d.category}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Contact Number</span>
                    <p className="font-semibold text-slate-700 mt-0.5 font-mono">{d.contact}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">License Expiry</span>
                    <p className={`font-semibold mt-0.5 font-mono ${
                      isLicenseExpired ? 'text-red-600 font-extrabold' : 'text-slate-250'
                    }`}>
                      {d.expiryDate} {isLicenseExpired && '(Expired)'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Safety Score</span>
                    <p className={`font-semibold mt-0.5 flex items-center gap-1.5 ${
                      isCriticalSafety ? 'text-red-600 font-extrabold' :
                      isWarningSafety ? 'text-amber-700' : 'text-emerald-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isCriticalSafety ? 'bg-red-400' :
                        isWarningSafety ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}></span>
                      {d.safetyScore} / 100
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-1.5">
                  {canEdit ? (
                    <>
                      <button
                        onClick={() => openEditModal(d)}
                        className="p-2 rounded-xl text-slate-500 bg-white border border-slate-200 hover:text-slate-900 hover:border-slate-200 transition-all cursor-pointer"
                        title="Edit Driver Profile"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id, d.name)}
                        className="p-2 rounded-xl text-slate-500 bg-white border border-slate-200 hover:text-red-600 hover:border-red-500/30 transition-all cursor-pointer"
                        title="Remove Driver"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => openEditModal(d)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-400 bg-white border border-slate-200 hover:text-slate-900 transition-all text-[11px] cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Details
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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
              {editingDriver ? (canEdit ? 'Edit Driver Profile' : 'Driver Qualifications') : 'Add New Driver Profile'}
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
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Driver Full Name</label>
                  <input
                    type="text"
                    required
                    disabled={!canEdit}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 placeholder-slate-600 outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">License Number</label>
                  <input
                    type="text"
                    required
                    disabled={!canEdit}
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    placeholder="e.g. DL-908711"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 placeholder-slate-600 outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">License Category</label>
                  <select
                    disabled={!canEdit}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500 disabled:opacity-50"
                  >
                    <option value="Class A">Class A (Combination Vehicles)</option>
                    <option value="Class B">Class B (Heavy Single Vehicles)</option>
                    <option value="Class C">Class C (Commercial / Light)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Contact Number</label>
                  <input
                    type="text"
                    required
                    disabled={!canEdit}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. +1-555-0199"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 placeholder-slate-600 outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">License Expiry Date</label>
                  <input
                    type="date"
                    required
                    disabled={!canEdit}
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Safety Score (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    disabled={!canEdit}
                    value={safetyScore}
                    onChange={(e) => setSafetyScore(e.target.value)}
                    placeholder="e.g. 95"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 placeholder-slate-600 outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Duty Status</label>
                <select
                  disabled={!canEdit}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500 disabled:opacity-50"
                >
                  <option value="Available">Available</option>
                  <option value="On Trip">On Trip</option>
                  <option value="Off Duty">Off Duty</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  {canEdit ? 'Cancel' : 'Close'}
                </button>
                {canEdit && (
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-semibold text-slate-900 shadow-lg transition-all cursor-pointer hover:from-indigo-600 hover:to-violet-600"
                  >
                    <Check className="h-4 w-4" />
                    Save Driver Profile
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

export default DriverManagement;
