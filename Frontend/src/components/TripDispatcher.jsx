import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, Plus, Play, CheckCircle2, XCircle, Search, X, Check, 
  AlertTriangle, AlertCircle, Info, Calendar, ArrowRight, MapPin, Scale, Navigation, Fuel, DollarSign
} from 'lucide-react';

const TripDispatcher = () => {
  const { 
    trips, vehicles, drivers, 
    createTrip, dispatchTrip, completeTrip, cancelTrip, deleteTrip 
  } = useData();
  const { user } = useAuth();

  // Drivers and Managers can manage dispatch
  const canDispatch = user?.role === 'Driver' || user?.role === 'Fleet Manager';

  // UI state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [activeTripForCompletion, setActiveTripForCompletion] = useState(null);
  
  // Completion form fields
  const [finalOdometer, setFinalOdometer] = useState('');
  const [fuelConsumed, setFuelConsumed] = useState('');
  const [fuelCost, setFuelCost] = useState('');

  const [error, setError] = useState('');

  // Trip Form fields
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [plannedDistance, setPlannedDistance] = useState('');
  const [revenue, setRevenue] = useState('');

  // Get available items for dispatch selection
  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableDrivers = drivers.filter(d => {
    const isExpired = new Date(d.expiryDate) < new Date();
    return d.status === 'Available' && !isExpired && d.status !== 'Suspended';
  });

  const openAddModal = () => {
    setError('');
    setSource('');
    setDestination('');
    setVehicleId(availableVehicles[0]?.id || '');
    setDriverId(availableDrivers[0]?.id || '');
    setCargoWeight('');
    setPlannedDistance('');
    setRevenue('');
    setIsModalOpen(true);
  };

  const openCompleteModal = (trip) => {
    setError('');
    setActiveTripForCompletion(trip);
    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    setFinalOdometer(vehicle ? (vehicle.odometer + trip.plannedDistance).toString() : '');
    setFuelConsumed(Math.round(trip.plannedDistance * 0.12).toString()); // sensible default 12L/100km
    setFuelCost(Math.round(trip.plannedDistance * 0.12 * 1.45).toString());
    setIsCompleteModalOpen(true);
  };

  const handleSubmitTrip = (e) => {
    e.preventDefault();
    setError('');

    if (!source || !destination || !vehicleId || !driverId || !cargoWeight || !plannedDistance) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      createTrip({
        source: source.trim(),
        destination: destination.trim(),
        vehicleId,
        driverId,
        cargoWeight: Number(cargoWeight),
        plannedDistance: Number(plannedDistance),
        revenue: revenue ? Number(revenue) : undefined
      });
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };

  const handleCompleteTripSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!finalOdometer || !fuelConsumed) {
      setError('Please fill in final odometer and fuel consumed.');
      return;
    }

    try {
      completeTrip(activeTripForCompletion.id, {
        finalOdometer: Number(finalOdometer),
        fuelConsumed: Number(fuelConsumed),
        fuelCost: Number(fuelCost) || undefined
      });
      setIsCompleteModalOpen(false);
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };

  const handleDispatch = (tripId) => {
    try {
      dispatchTrip(tripId);
    } catch (err) {
      alert(err.message || 'Failed to dispatch.');
    }
  };

  const handleCancel = (tripId) => {
    if (window.confirm('Are you sure you want to cancel this trip?')) {
      try {
        cancelTrip(tripId);
      } catch (err) {
        alert(err.message || 'Failed to cancel.');
      }
    }
  };

  const handleDelete = (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip record?')) {
      try {
        deleteTrip(tripId);
      } catch (err) {
        alert(err.message || 'Failed to delete trip.');
      }
    }
  };

  // Filter trips
  const filteredTrips = trips.filter(t => {
    const vehicle = vehicles.find(v => v.id === t.vehicleId);
    const driver = drivers.find(d => d.id === t.driverId);
    const matchesSearch = t.source.toLowerCase().includes(search.toLowerCase()) || 
                          t.destination.toLowerCase().includes(search.toLowerCase()) ||
                          (vehicle && vehicle.regNo.toLowerCase().includes(search.toLowerCase())) ||
                          (driver && driver.name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner and Access Banner */}
      <div className="flex flex-col gap-4">
        {!canDispatch && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
            <Info className="h-4.5 w-4.5 shrink-0" />
            <p><strong>Read-Only Mode:</strong> Only users with the <strong>Driver</strong> or <strong>Fleet Manager</strong> role can create, dispatch, complete, or cancel trips.</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Trip Dispatcher</h2>
            <p className="text-xs text-slate-400">Plan routes, assign drivers, and log final trip values</p>
          </div>
          {canDispatch && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Dispatch Trip
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
            placeholder="Search by source, destination, vehicle, driver..."
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
          <option value="All">All Trip Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Trips list */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-xl">
          <Compass className="h-12 w-12 text-slate-700 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-400">No trips found</p>
          <p className="text-xs text-slate-400 mt-1">Plan a new route to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrips.map(t => {
            const vehicle = vehicles.find(v => v.id === t.vehicleId);
            const driver = drivers.find(d => d.id === t.driverId);

            return (
              <div 
                key={t.id} 
                className={`rounded-2xl border bg-white/40 p-5 backdrop-blur-md border-slate-200 hover:border-slate-200 transition-all duration-300`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Trip Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'Draft' ? 'bg-slate-800 text-slate-600 border border-slate-200' :
                        t.status === 'Dispatched' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
                        t.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        {t.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {t.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-bold text-slate-900 text-base">
                      <span className="flex items-center gap-1 text-slate-700">
                        <MapPin className="h-4 w-4 text-indigo-600" />
                        {t.source}
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="flex items-center gap-1 text-slate-700">
                        <MapPin className="h-4 w-4 text-violet-700" />
                        {t.destination}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Vehicle Assigned</span>
                        <p className="font-semibold text-slate-700 mt-0.5">{vehicle ? vehicle.name : 'Unassigned'}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{vehicle?.regNo}</p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Driver Assigned</span>
                        <p className="font-semibold text-slate-700 mt-0.5">{driver ? driver.name : 'Unassigned'}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{driver?.licenseNo}</p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Cargo Weight</span>
                        <p className="font-semibold text-slate-700 mt-0.5">{t.cargoWeight.toLocaleString()} kg</p>
                        <p className="text-[9px] text-slate-400">Cap: {vehicle?.maxCapacity}kg</p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Distance & revenue</span>
                        <p className="font-semibold text-slate-700 mt-0.5 font-mono">{t.plannedDistance} km</p>
                        <p className="text-[10px] font-bold text-emerald-700 mt-0.5">${t.revenue.toLocaleString()}</p>
                      </div>
                    </div>

                    {t.status === 'Completed' && (
                      <div className="mt-3 p-3 bg-emerald-950/10 border border-emerald-500/10 rounded-xl grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400">Odometer start/end</span>
                          <p className="font-semibold text-slate-600 mt-0.5 font-mono">{t.odometerStart} → {t.odometerEnd} km</p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400">Fuel Consumed</span>
                          <p className="font-semibold text-slate-600 mt-0.5 font-mono">{t.fuelConsumed} Liters</p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400">Fuel Efficiency</span>
                          <p className="font-semibold text-emerald-700 mt-0.5 font-mono">
                            {t.fuelConsumed > 0 ? (Math.round((t.odometerEnd - t.odometerStart) / t.fuelConsumed * 10) / 10) : 0} km/L
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0 pt-2 border-t md:border-t-0 md:pt-0 border-slate-200">
                    {canDispatch && t.status === 'Draft' && (
                      <button
                        onClick={() => handleDispatch(t.id)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white transition-all cursor-pointer w-full"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Dispatch Trip
                      </button>
                    )}

                    {canDispatch && t.status === 'Dispatched' && (
                      <button
                        onClick={() => openCompleteModal(t)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-650 hover:bg-emerald-600 px-4 py-2 text-xs font-semibold text-slate-900 transition-all cursor-pointer w-full"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Complete Trip
                      </button>
                    )}

                    {canDispatch && (t.status === 'Draft' || t.status === 'Dispatched') && (
                      <button
                        onClick={() => handleCancel(t.id)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 px-4 py-2 text-xs font-semibold transition-all cursor-pointer w-full"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Cancel Trip
                      </button>
                    )}

                    {canDispatch && (t.status === 'Cancelled' || t.status === 'Completed') && (
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-red-700 px-4 py-2 text-xs font-semibold transition-all cursor-pointer w-full"
                      >
                        Delete Record
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-4">Create Dispatch Trip</h3>

            {availableVehicles.length === 0 || availableDrivers.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs mb-4 space-y-1">
                <AlertTriangle className="h-5 w-5 mb-1" />
                <p className="font-bold">Missing Resources</p>
                <p>You need at least one <strong>Available</strong> vehicle and one <strong>Available</strong> driver (with non-expired license and not suspended) to schedule a trip.</p>
              </div>
            ) : null}

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 mb-4">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmitTrip} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Departure Source</label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      placeholder="e.g. Chicago Depot"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-650 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Destination</label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Detroit Terminal"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-650 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Select Available Vehicle</label>
                  <select
                    required
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500"
                  >
                    <option value="" disabled>Select vehicle</option>
                    {availableVehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.regNo}) - Max: {v.maxCapacity}kg
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Select Available Driver</label>
                  <select
                    required
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 mt-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500"
                  >
                    <option value="" disabled>Select driver</option>
                    {availableDrivers.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.category}) - Safety: {d.safetyScore}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Cargo Weight (kg)</label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Scale className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      required
                      value={cargoWeight}
                      onChange={(e) => setCargoWeight(e.target.value)}
                      placeholder="e.g. 800"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-650 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Distance (km)</label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Navigation className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      required
                      value={plannedDistance}
                      onChange={(e) => setPlannedDistance(e.target.value)}
                      placeholder="e.g. 350"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-650 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Est Revenue ($)</label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      placeholder="Auto computed"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-650 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
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
                  disabled={availableVehicles.length === 0 || availableDrivers.length === 0}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-semibold text-slate-900 shadow-lg transition-all cursor-pointer hover:from-indigo-600 hover:to-violet-600 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  Save Draft Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Trip Modal */}
      {isCompleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCompleteModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Complete Trip Logs</h3>
            <p className="text-xs text-slate-400 mb-4">Enter final readings from vehicle logbook to update odometer & fuel logs.</p>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 mb-4">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleCompleteTripSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Final Odometer Reading (km)</label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Navigation className="h-4 w-4" />
                  </div>
                  <input
                    type="number"
                    required
                    value={finalOdometer}
                    onChange={(e) => setFinalOdometer(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-650 outline-none focus:border-indigo-500"
                  />
                </div>
                {activeTripForCompletion && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Start odometer was: <strong>{vehicles.find(v => v.id === activeTripForCompletion.vehicleId)?.odometer} km</strong>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Fuel Consumed (Liters)</label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Fuel className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      required
                      value={fuelConsumed}
                      onChange={(e) => setFuelConsumed(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-650 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Total Fuel Cost ($)</label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      required
                      value={fuelCost}
                      onChange={(e) => setFuelCost(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-650 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCompleteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-650 hover:bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-slate-900 shadow-lg transition-all cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  Complete & Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDispatcher;
