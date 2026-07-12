const mongoose = require('mongoose');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const Maintenance = require('../models/Maintenance');
const FuelLog = require('../models/FuelLog');
const Expense = require('../models/Expense');

const seedDB = async () => {
  try {
    console.log('Dropping existing database for a clean seed...');
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped.');

    console.log('Seeding database with fresh initial data...');

    // 1. Seed Users
    console.log('Seeding users...');
    const users = await User.create([
      { name: 'Fleet Manager Alice', email: 'manager@transitops.com', password: 'password123', role: 'Fleet Manager' },
      { name: 'Driver Bob', email: 'driver@transitops.com', password: 'password123', role: 'Driver' },
      { name: 'Safety Officer Charlie', email: 'safety@transitops.com', password: 'password123', role: 'Safety Officer' },
      { name: 'Financial Analyst David', email: 'analyst@transitops.com', password: 'password123', role: 'Financial Analyst' },
    ]);
    console.log(`Seeded ${users.length} users.`);

    // 2. Seed Vehicles
    console.log('Seeding vehicles...');
    const vehiclesData = [
      { regNo: 'VN-01-9021', name: 'Ford Transit 2022', type: 'Van', maxCapacity: 1200, odometer: 42500, acquisitionCost: 32000, status: 'Available', region: 'North', revenue: 8500 },
      { regNo: 'TR-02-4581', name: 'Volvo FH16', type: 'Heavy Truck', maxCapacity: 15000, odometer: 128000, acquisitionCost: 110000, status: 'On Trip', region: 'East', revenue: 35000 },
      { regNo: 'VN-03-7729', name: 'Mercedes Sprinter', type: 'Van', maxCapacity: 1500, odometer: 85200, acquisitionCost: 45000, status: 'In Shop', region: 'South', revenue: 12000 },
      { regNo: 'SD-04-1102', name: 'Toyota Prius', type: 'Sedan', maxCapacity: 400, odometer: 15000, acquisitionCost: 24000, status: 'Available', region: 'West', revenue: 3200 },
      { regNo: 'VN-05-9988', name: 'Chevrolet Express', type: 'Van', maxCapacity: 500, odometer: 5000, acquisitionCost: 28000, status: 'Available', region: 'North', revenue: 500 }
    ];
    const seededVehicles = await Vehicle.create(vehiclesData);
    console.log(`Seeded ${seededVehicles.length} vehicles.`);

    // 3. Seed Drivers
    console.log('Seeding drivers...');
    const driversData = [
      { name: 'Alex Johnson', licenseNo: 'DL-908711', category: 'Class A', expiryDate: '2028-09-15', contact: '+1-555-0199', safetyScore: 95, status: 'Available' },
      { name: 'Sarah Miller', licenseNo: 'DL-124982', category: 'Class A', expiryDate: '2027-11-20', contact: '+1-555-0182', safetyScore: 88, status: 'On Trip' },
      { name: 'Marcus Brody', licenseNo: 'DL-882736', category: 'Class B', expiryDate: '2026-02-10', contact: '+1-555-0177', safetyScore: 75, status: 'Off Duty' },
      { name: 'Elena Rostova', licenseNo: 'DL-552431', category: 'Class A', expiryDate: '2029-05-30', contact: '+1-555-0155', safetyScore: 92, status: 'Available' },
      { name: 'James Carter', licenseNo: 'DL-448291', category: 'Class C', expiryDate: '2026-08-25', contact: '+1-555-0144', safetyScore: 60, status: 'Suspended' }
    ];
    const seededDrivers = await Driver.create(driversData);
    console.log(`Seeded ${seededDrivers.length} drivers.`);

    const v1 = seededVehicles[0];
    const v2 = seededVehicles[1];
    const v4 = seededVehicles[3];

    const d1 = seededDrivers[0];
    const d2 = seededDrivers[1];
    const d4 = seededDrivers[3];

    // 4. Seed Trips
    console.log('Seeding trips...');
    const tripsData = [
      { source: 'Chicago Warehouse', destination: 'Detroit Hub', vehicleId: v2._id, driverId: d2._id, cargoWeight: 8500, plannedDistance: 450, status: 'Dispatched', revenue: 2800, date: '2026-07-11' },
      { source: 'New York Depot', destination: 'Boston Center', vehicleId: v1._id, driverId: d1._id, cargoWeight: 600, plannedDistance: 350, status: 'Completed', revenue: 1500, date: '2026-07-05', odometerStart: 42150, odometerEnd: 42500, fuelConsumed: 45 },
      { source: 'Los Angeles Port', destination: 'Phoenix Terminal', vehicleId: v4._id, driverId: d4._id, cargoWeight: 200, plannedDistance: 600, status: 'Draft', revenue: 1200, date: '2026-07-12' }
    ];
    await Trip.create(tripsData);

    // 5. Seed Maintenance
    console.log('Seeding maintenance...');
    const v3 = seededVehicles[2];
    const maintenanceData = [
      { vehicleId: v3._id, serviceType: 'Engine Tune-up', description: 'Replacing spark plugs and fuel filter', cost: 450, startDate: '2026-07-10', endDate: '2026-07-15', status: 'Active' },
      { vehicleId: v1._id, serviceType: 'Oil Change', description: 'Standard 10k mile synthetic oil change', cost: 80, startDate: '2026-06-05', endDate: '2026-06-05', status: 'Closed' }
    ];
    await Maintenance.create(maintenanceData);

    // 6. Seed FuelLogs
    console.log('Seeding fuel logs...');
    const v5 = seededVehicles[4];
    const fuelLogsData = [
      { vehicleId: v1._id, liters: 45, cost: 65, date: '2026-06-12' },
      { vehicleId: v2._id, liters: 220, cost: 320, date: '2026-07-01' },
      { vehicleId: v5._id, liters: 30, cost: 42, date: '2026-07-08' }
    ];
    await FuelLog.create(fuelLogsData);

    // 7. Seed Expenses
    console.log('Seeding expenses...');
    const expensesData = [
      { vehicleId: v2._id, type: 'Toll', cost: 45, date: '2026-07-02', description: 'I-90 Turnpike Tolls' },
      { vehicleId: v3._id, type: 'Maintenance', cost: 450, date: '2026-07-10', description: 'Engine Tune-up' },
      { vehicleId: v1._id, type: 'Maintenance', cost: 80, date: '2026-06-05', description: 'Oil Change' }
    ];
    await Expense.create(expensesData);

    console.log('Database seeding finished successfully.');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

module.exports = seedDB;
