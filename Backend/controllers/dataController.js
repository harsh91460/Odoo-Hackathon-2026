const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const Maintenance = require('../models/Maintenance');
const FuelLog = require('../models/FuelLog');
const Expense = require('../models/Expense');

// --- VEHICLES ---
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createVehicle = async (req, res) => {
  try {
    const { regNo, name, type, maxCapacity, odometer, acquisitionCost, status, region } = req.body;
    
    // Check uniqueness
    const exists = await Vehicle.findOne({ regNo: regNo.toUpperCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Vehicle Registration Number must be unique.' });
    }

    const vehicle = await Vehicle.create({
      regNo: regNo.toUpperCase(),
      name,
      type,
      maxCapacity,
      odometer,
      acquisitionCost,
      status: status || 'Available',
      region: region || 'North',
      revenue: 0
    });

    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { regNo, name, type, maxCapacity, odometer, acquisitionCost, status, region, revenue } = req.body;

    if (regNo) {
      const exists = await Vehicle.findOne({ _id: { $ne: id }, regNo: regNo.toUpperCase() });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Vehicle Registration Number must be unique.' });
      }
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      {
        ...(regNo && { regNo: regNo.toUpperCase() }),
        name,
        type,
        maxCapacity,
        odometer,
        acquisitionCost,
        status,
        region,
        revenue
      },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if vehicle has active/draft trips
    const activeTrips = await Trip.findOne({
      vehicleId: id,
      status: { $in: ['Dispatched', 'Draft'] }
    });

    if (activeTrips) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete vehicle currently assigned to active/draft trips.'
      });
    }

    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- DRIVERS ---
const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json({ success: true, data: drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createDriver = async (req, res) => {
  try {
    const { name, licenseNo, category, expiryDate, contact, safetyScore, status } = req.body;

    const exists = await Driver.findOne({ licenseNo: licenseNo.toUpperCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'License number must be unique.' });
    }

    const driver = await Driver.create({
      name,
      licenseNo: licenseNo.toUpperCase(),
      category,
      expiryDate,
      contact,
      safetyScore: safetyScore !== undefined ? safetyScore : 80,
      status: status || 'Available'
    });

    res.status(201).json({ success: true, data: driver });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, licenseNo, category, expiryDate, contact, safetyScore, status } = req.body;

    if (licenseNo) {
      const exists = await Driver.findOne({ _id: { $ne: id }, licenseNo: licenseNo.toUpperCase() });
      if (exists) {
        return res.status(400).json({ success: false, message: 'License number must be unique.' });
      }
    }

    const driver = await Driver.findByIdAndUpdate(
      id,
      {
        name,
        ...(licenseNo && { licenseNo: licenseNo.toUpperCase() }),
        category,
        expiryDate,
        contact,
        safetyScore,
        status
      },
      { new: true, runValidators: true }
    );

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const activeTrips = await Trip.findOne({
      driverId: id,
      status: { $in: ['Dispatched', 'Draft'] }
    });

    if (activeTrips) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete driver currently assigned to active/draft trips.'
      });
    }

    const driver = await Driver.findByIdAndDelete(id);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.status(200).json({ success: true, message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- TRIPS ---
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find();
    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTrip = async (req, res) => {
  try {
    const { vehicleId, driverId, cargoWeight, source, destination, plannedDistance, revenue } = req.body;

    // Validate vehicle
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Selected vehicle does not exist.' });
    if (vehicle.status === 'Retired' || vehicle.status === 'In Shop') {
      return res.status(400).json({ success: false, message: 'Retired or In Shop vehicles must never be dispatched.' });
    }
    if (vehicle.status === 'On Trip') {
      return res.status(400).json({ success: false, message: 'Vehicle is already marked On Trip.' });
    }

    // Validate driver
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ success: false, message: 'Selected driver does not exist.' });
    
    // Check expired license
    const isExpired = new Date(driver.expiryDate) < new Date();
    if (isExpired) return res.status(400).json({ success: false, message: 'Drivers with expired licenses cannot be assigned to trips.' });
    if (driver.status === 'Suspended') return res.status(400).json({ success: false, message: 'Suspended drivers cannot be assigned to trips.' });
    if (driver.status === 'On Trip') return res.status(400).json({ success: false, message: 'Driver is already marked On Trip.' });

    // Validate load capacity
    if (Number(cargoWeight) > vehicle.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: `Cargo Weight (${cargoWeight} kg) exceeds the vehicle's maximum load capacity (${vehicle.maxCapacity} kg).`
      });
    }

    const calculatedRevenue = revenue !== undefined && revenue !== '' ? Number(revenue) : Math.round(Number(plannedDistance) * 3.5);

    const trip = await Trip.create({
      source,
      destination,
      vehicleId,
      driverId,
      cargoWeight: Number(cargoWeight),
      plannedDistance: Number(plannedDistance),
      revenue: calculatedRevenue,
      status: 'Draft',
      date: new Date().toISOString().split('T')[0]
    });

    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const dispatchTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
    if (trip.status !== 'Draft') return res.status(400).json({ success: false, message: 'Only draft trips can be dispatched.' });

    const vehicle = await Vehicle.findById(trip.vehicleId);
    const driver = await Driver.findById(trip.driverId);

    if (!vehicle || vehicle.status !== 'Available') {
      return res.status(400).json({ success: false, message: 'Vehicle is no longer available.' });
    }
    if (!driver || driver.status !== 'Available') {
      return res.status(400).json({ success: false, message: 'Driver is no longer available.' });
    }

    // Dispatch trip
    trip.status = 'Dispatched';
    await trip.save();

    // Update vehicle and driver status
    vehicle.status = 'On Trip';
    await vehicle.save();

    driver.status = 'On Trip';
    await driver.save();

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const completeTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { finalOdometer, fuelConsumed, fuelCost } = req.body;

    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
    if (trip.status !== 'Dispatched') return res.status(400).json({ success: false, message: 'Only dispatched trips can be completed.' });

    const vehicle = await Vehicle.findById(trip.vehicleId);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });

    if (Number(finalOdometer) < vehicle.odometer) {
      return res.status(400).json({
        success: false,
        message: `Final odometer (${finalOdometer} km) cannot be less than vehicle's start odometer (${vehicle.odometer} km).`
      });
    }

    const startOdo = vehicle.odometer;

    // Complete trip
    trip.status = 'Completed';
    trip.odometerStart = startOdo;
    trip.odometerEnd = Number(finalOdometer);
    trip.fuelConsumed = Number(fuelConsumed);
    await trip.save();

    // Reset vehicle and driver
    vehicle.status = 'Available';
    vehicle.odometer = Number(finalOdometer);
    vehicle.revenue += trip.revenue;
    await vehicle.save();

    await Driver.findByIdAndUpdate(trip.driverId, { status: 'Available' });

    // Handle fuel logging and expenses
    if (Number(fuelConsumed) > 0) {
      const actualFuelCost = Number(fuelCost) || Math.round(Number(fuelConsumed) * 1.4);
      const today = new Date().toISOString().split('T')[0];

      await FuelLog.create({
        vehicleId: trip.vehicleId,
        liters: Number(fuelConsumed),
        cost: actualFuelCost,
        date: today
      });

      await Expense.create({
        vehicleId: trip.vehicleId,
        type: 'Fuel',
        cost: actualFuelCost,
        date: today,
        description: `Fuel for Trip: ${trip.source} → ${trip.destination}`
      });
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const cancelTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    const wasDispatched = trip.status === 'Dispatched';

    trip.status = 'Cancelled';
    await trip.save();

    if (wasDispatched) {
      await Vehicle.findByIdAndUpdate(trip.vehicleId, { status: 'Available' });
      await Driver.findByIdAndUpdate(trip.driverId, { status: 'Available' });
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
    if (trip.status === 'Dispatched') {
      return res.status(400).json({ success: false, message: 'Cannot delete an active dispatched trip. Cancel it first.' });
    }

    await Trip.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- MAINTENANCE ---
const getMaintenance = async (req, res) => {
  try {
    const records = await Maintenance.find();
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createMaintenance = async (req, res) => {
  try {
    const { vehicleId, serviceType, description, cost, startDate, endDate } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Selected vehicle not found.' });
    if (vehicle.status === 'On Trip') {
      return res.status(400).json({ success: false, message: 'Vehicle is currently on a trip. Cannot put in maintenance.' });
    }

    const record = await Maintenance.create({
      vehicleId,
      serviceType,
      description,
      cost: Number(cost),
      startDate,
      endDate: endDate || '',
      status: 'Active'
    });

    vehicle.status = 'In Shop';
    await vehicle.save();

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const closeMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { endDate, cost } = req.body;

    const maint = await Maintenance.findById(id);
    if (!maint) return res.status(404).json({ success: false, message: 'Maintenance record not found.' });
    if (maint.status === 'Closed') return res.status(400).json({ success: false, message: 'Maintenance record is already closed.' });

    const todayStr = new Date().toISOString().split('T')[0];
    const finalEndDate = endDate || todayStr;
    const finalCost = cost !== undefined ? Number(cost) : maint.cost;

    maint.status = 'Closed';
    maint.endDate = finalEndDate;
    maint.cost = finalCost;
    await maint.save();

    // Restore vehicle status (unless retired)
    const vehicle = await Vehicle.findById(maint.vehicleId);
    if (vehicle && vehicle.status === 'In Shop') {
      vehicle.status = 'Available';
      await vehicle.save();
    }

    // Add to expenses
    await Expense.create({
      vehicleId: maint.vehicleId,
      type: 'Maintenance',
      cost: finalCost,
      date: finalEndDate,
      description: `${maint.serviceType}: ${maint.description}`
    });

    res.status(200).json({ success: true, data: maint });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- FUEL LOGS ---
const getFuelLogs = async (req, res) => {
  try {
    const logs = await FuelLog.find();
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFuelLog = async (req, res) => {
  try {
    const { vehicleId, liters, cost, date } = req.body;

    const log = await FuelLog.create({
      vehicleId,
      liters: Number(liters),
      cost: Number(cost),
      date
    });

    // Add to expense
    await Expense.create({
      vehicleId,
      type: 'Fuel',
      cost: Number(cost),
      date,
      description: `Fuel log: ${liters}L`
    });

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- EXPENSES ---
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { vehicleId, type, cost, date, description } = req.body;

    const expense = await Expense.create({
      vehicleId,
      type,
      cost: Number(cost),
      date,
      description
    });

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  getTrips,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  deleteTrip,
  getMaintenance,
  createMaintenance,
  closeMaintenance,
  getFuelLogs,
  createFuelLog,
  getExpenses,
  createExpense
};
