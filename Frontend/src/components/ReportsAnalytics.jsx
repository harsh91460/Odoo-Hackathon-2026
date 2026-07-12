import { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Download, TrendingUp, Info, DollarSign, Fuel
} from 'lucide-react';

const ReportsAnalytics = () => {
  const { vehicles, trips, expenses, fuelLogs } = useData();
  const [regionFilter, setRegionFilter] = useState('All');

  // Filter vehicles
  const filteredVehicles = vehicles.filter(v => regionFilter === 'All' || v.region === regionFilter);

  // Compute reports for each vehicle
  const vehicleReports = filteredVehicles.map(v => {
    // 1. Total distance completed by vehicle
    const vehicleTrips = trips.filter(t => t.vehicleId === v.id && t.status === 'Completed');
    const totalDistance = vehicleTrips.reduce((sum, t) => sum + t.plannedDistance, 0);

    // 2. Total fuel consumed by vehicle
    const vehicleFuelLogs = fuelLogs.filter(f => f.vehicleId === v.id);
    const totalFuelLiters = vehicleFuelLogs.reduce((sum, f) => sum + f.liters, 0);
    const totalFuelCost = vehicleFuelLogs.reduce((sum, f) => sum + f.cost, 0);

    // 3. Maintenance Cost
    const totalMaintCost = expenses
      .filter(e => e.vehicleId === v.id && e.type === 'Maintenance')
      .reduce((sum, e) => sum + e.cost, 0);

    // 4. General/Other expenses
    const totalOtherCost = expenses
      .filter(e => e.vehicleId === v.id && e.type !== 'Maintenance' && e.type !== 'Fuel')
      .reduce((sum, e) => sum + e.cost, 0);

    // 5. Total operational cost (Fuel + Maintenance + Others)
    const totalOperationalCost = totalFuelCost + totalMaintCost + totalOtherCost;

    // 6. Fuel Efficiency = Distance / Fuel
    const fuelEfficiency = totalFuelLiters > 0 ? (totalDistance / totalFuelLiters) : 0;

    // 7. Vehicle ROI = (Revenue - Operational Cost) / Acquisition Cost
    const revenue = v.revenue || 0;
    const roi = v.acquisitionCost > 0 ? ((revenue - totalOperationalCost) / v.acquisitionCost * 100) : 0;

    return {
      id: v.id,
      name: v.name,
      regNo: v.regNo,
      type: v.type,
      region: v.region || 'North',
      acquisitionCost: v.acquisitionCost,
      distance: totalDistance,
      fuelLiters: totalFuelLiters,
      fuelCost: totalFuelCost,
      maintCost: totalMaintCost,
      operationalCost: totalOperationalCost,
      fuelEfficiency,
      revenue,
      roi
    };
  });

  // Global KPIs
  const totalRevenue = vehicleReports.reduce((sum, r) => sum + r.revenue, 0);
  const totalOperationalCost = vehicleReports.reduce((sum, r) => sum + r.operationalCost, 0);
  const avgFuelEfficiency = vehicleReports.filter(r => r.fuelEfficiency > 0).length > 0 
    ? (vehicleReports.reduce((sum, r) => sum + r.fuelEfficiency, 0) / vehicleReports.filter(r => r.fuelEfficiency > 0).length) 
    : 0;

  const fleetROI = vehicles.reduce((sum, v) => sum + v.acquisitionCost, 0) > 0
    ? ((totalRevenue - totalOperationalCost) / vehicles.reduce((sum, v) => sum + v.acquisitionCost, 0) * 100)
    : 0;

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Registration Number',
      'Vehicle Name',
      'Vehicle Type',
      'Operating Region',
      'Acquisition Cost ($)',
      'Total Distance (km)',
      'Fuel Consumed (L)',
      'Fuel Cost ($)',
      'Maintenance Cost ($)',
      'Total Operational Cost ($)',
      'Revenue Generated ($)',
      'Fuel Efficiency (km/L)',
      'ROI (%)'
    ];

    const rows = vehicleReports.map(r => [
      r.regNo,
      r.name,
      r.type,
      r.region,
      r.acquisitionCost,
      r.distance,
      r.fuelLiters,
      r.fuelCost,
      r.maintCost,
      r.operationalCost,
      r.revenue,
      r.fuelEfficiency.toFixed(2),
      r.roi.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TransitOps_Fleet_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Reports & Fleet Analytics</h2>
          <p className="text-xs text-slate-400">Export datasets and evaluate vehicle return on investment (ROI)</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
          >
            <option value="All">All Regions</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>
          
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Overviews */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white/30 p-5 backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Gross Fleet Revenue</span>
              <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">${totalRevenue.toLocaleString()}</h4>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/30 p-5 backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Operations Cost</span>
              <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">${totalOperationalCost.toLocaleString()}</h4>
            </div>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/30 p-5 backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Avg Fuel Efficiency</span>
              <h4 className="text-2xl font-extrabold text-indigo-600 tracking-tight mt-1">{avgFuelEfficiency.toFixed(2)} km/L</h4>
            </div>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Fuel className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/30 p-5 backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Net Fleet ROI</span>
              <h4 className={`text-2xl font-extrabold tracking-tight mt-1 ${
                fleetROI >= 0 ? 'text-emerald-700' : 'text-rose-400'
              }`}>{fleetROI.toFixed(1)}%</h4>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>
      </div>

      {/* ROI Explanation Alert */}
      <div className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-xs text-slate-700">
        <Info className="h-5 w-5 shrink-0 text-indigo-600" />
        <div className="space-y-0.5">
          <h5 className="font-bold text-slate-900">Understanding Vehicle ROI</h5>
          <p className="opacity-90">Vehicle Return on Investment (ROI) is calculated using: <code>[ (Revenue - (Maintenance + Fuel)) / Acquisition Cost ] * 100</code>. A higher positive percentage indicates the vehicle asset has paid off a larger portion of its purchase price.</p>
        </div>
      </div>

      {/* Main Table Report */}
      <div className="bg-white/40 border border-slate-200 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/20 text-slate-400 font-semibold">
                <th className="p-4">Vehicle Specs</th>
                <th className="p-4 text-center">Distance</th>
                <th className="p-4 text-center">Fuel Consumption</th>
                <th className="p-4 text-center">Fuel Efficiency</th>
                <th className="p-4 text-center">Maintenance</th>
                <th className="p-4 text-center">Total Oper. Cost</th>
                <th className="p-4 text-center">Acq. Cost</th>
                <th className="p-4 text-center">Revenue</th>
                <th className="p-4 text-right">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              {vehicleReports.map(r => (
                <tr key={r.id} className="hover:bg-white/10">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{r.name}</span>
                    <span className="text-[9px] text-slate-400 block font-mono mt-0.5">{r.regNo} | {r.type}</span>
                  </td>
                  <td className="p-4 text-center font-mono">{r.distance.toLocaleString()} km</td>
                  <td className="p-4 text-center font-mono">{r.fuelLiters.toLocaleString()} L</td>
                  <td className="p-4 text-center font-mono font-semibold text-slate-700">
                    {r.fuelEfficiency > 0 ? `${r.fuelEfficiency.toFixed(1)} km/L` : '—'}
                  </td>
                  <td className="p-4 text-center text-rose-450 font-mono">${r.maintCost.toLocaleString()}</td>
                  <td className="p-4 text-center text-rose-400 font-mono">${r.operationalCost.toLocaleString()}</td>
                  <td className="p-4 text-center text-slate-500 font-mono">${r.acquisitionCost.toLocaleString()}</td>
                  <td className="p-4 text-center text-emerald-450 font-mono font-bold">${r.revenue.toLocaleString()}</td>
                  <td className={`p-4 text-right font-extrabold font-mono ${
                    r.roi >= 0 ? 'text-emerald-700' : 'text-rose-400'
                  }`}>
                    {r.roi.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
