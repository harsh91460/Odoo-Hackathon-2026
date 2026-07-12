import DataTable from '../components/ui/DataTable';

export default function Vehicles() {
  // Define your table headers and the keys that map to your data
  const columns = [
    { header: 'Reg. No. (Unique)', accessor: 'id' },
    { header: 'Name/Model', accessor: 'name' },
    { header: 'Type', accessor: 'type' },
    { header: 'Capacity', accessor: 'capacity' },
    { header: 'Odometer', accessor: 'odometer' },
    { header: 'Acq. Cost', accessor: 'cost' },
    { header: 'Status', accessor: 'status' },
  ];

  // Dummy data matching your wireframe exactly
  const vehicleData = [
    { id: 'GJ01AB4521', name: 'VAN-05', type: 'Van', capacity: '500 kg', odometer: '74,000', cost: '6,20,000', status: 'Available' },
    { id: 'GJ01AB9981', name: 'TRUCK-11', type: 'Truck', capacity: '5 Ton', odometer: '182,000', cost: '24,50,000', status: 'On Trip' },
    { id: 'GJ01AB1120', name: 'MINI-03', type: 'Mini', capacity: '1 Ton', odometer: '66,000', cost: '4,10,000', status: 'In Shop' },
    { id: 'GJ01AB0081', name: 'VAN-09', type: 'Van', capacity: '750 kg', odometer: '241,900', cost: '5,90,000', status: 'Retired' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-3">
          <select className="bg-panel border border-border rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary">
            <option>Type: All</option>
            <option>Van</option>
            <option>Truck</option>
          </select>
          <select className="bg-panel border border-border rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary">
            <option>Status: All</option>
            <option>Available</option>
            <option>On Trip</option>
          </select>
        </div>
        
        <button className="bg-[#E06C00] hover:bg-[#B35600] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors shadow-lg">
          + Add Vehicle
        </button>
      </div>

      {/* The Data Table */}
      <DataTable columns={columns} data={vehicleData} />
      
      <p className="text-xs text-status-orange font-medium mt-2">
        Rule: Registration No. must be unique • Retired/In Shop vehicles are hidden from Trip Dispatcher
      </p>

    </div>
  );
}