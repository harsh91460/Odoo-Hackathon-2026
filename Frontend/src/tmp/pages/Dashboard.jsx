import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';

export default function Dashboard() {
  // Dummy data to simulate your backend API response
  const recentTrips = [
    { id: 'TR001', vehicle: 'VAN-05', driver: 'Alex', status: 'On Trip', eta: '45 min' },
    { id: 'TR002', vehicle: 'TRK-12', driver: 'John', status: 'Completed', eta: '-' },
    { id: 'TR003', vehicle: 'MINI-08', driver: 'Priya', status: 'Dispatched', eta: '1h 10m' },
    { id: 'TR004', vehicle: '-', driver: '-', status: 'Draft', eta: 'Awaiting vehicle' },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* KPI Grid (Maps exactly to your mockup layout) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <KPICard title="Active Vehicles" value="53" borderTopColor="border-status-blue" />
        <KPICard title="Available Vehicles" value="42" borderTopColor="border-status-green" />
        <KPICard title="Vehicles in Maintenance" value="05" borderTopColor="border-status-orange" />
        <KPICard title="Active Trips" value="18" borderTopColor="border-status-blue" />
        <KPICard title="Pending Trips" value="09" />
        <KPICard title="Drivers On Duty" value="26" borderTopColor="border-status-blue" />
        <KPICard title="Fleet Utilization" value="81%" borderTopColor="border-status-green" />
      </div>

      {/* Split Layout: Recent Trips (Left) & Status Bars (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Trips Table */}
        <div className="lg:col-span-2 bg-panel rounded-md border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-black/20">
            <h3 className="text-sm font-semibold text-gray-200">RECENT TRIPS</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-black/10 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 font-medium">Trip</th>
                  <th className="px-4 py-3 font-medium">Vehicle</th>
                  <th className="px-4 py-3 font-medium">Driver</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{trip.id}</td>
                    <td className="px-4 py-3">{trip.vehicle}</td>
                    <td className="px-4 py-3">{trip.driver}</td>
                    <td className="px-4 py-3"><StatusBadge status={trip.status} /></td>
                    <td className="px-4 py-3 text-gray-400">{trip.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Fleet Status Summary */}
        <div className="bg-panel rounded-md border border-border p-4">
          <h3 className="text-sm font-semibold text-gray-200 mb-4 uppercase">Vehicle Status</h3>
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">Available</span>
                <span className="text-white font-medium">42</span>
              </div>
              <div className="w-full bg-black rounded-full h-2">
                <div className="bg-status-green h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">On Trip</span>
                <span className="text-white font-medium">53</span>
              </div>
              <div className="w-full bg-black rounded-full h-2">
                <div className="bg-status-blue h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">In Shop</span>
                <span className="text-white font-medium">5</span>
              </div>
              <div className="w-full bg-black rounded-full h-2">
                <div className="bg-status-orange h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}