const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/dataController');

// All routes are protected by JWT authentication
router.use(protect);

// Vehicle routes
router.route('/vehicles')
  .get(getVehicles)
  .post(createVehicle);

router.route('/vehicles/:id')
  .put(updateVehicle)
  .delete(deleteVehicle);

// Driver routes
router.route('/drivers')
  .get(getDrivers)
  .post(createDriver);

router.route('/drivers/:id')
  .put(updateDriver)
  .delete(deleteDriver);

// Trip routes
router.route('/trips')
  .get(getTrips)
  .post(createTrip);

router.route('/trips/:id')
  .delete(deleteTrip);

router.put('/trips/dispatch/:id', dispatchTrip);
router.put('/trips/complete/:id', completeTrip);
router.put('/trips/cancel/:id', cancelTrip);

// Maintenance routes
router.route('/maintenance')
  .get(getMaintenance)
  .post(createMaintenance);

router.put('/maintenance/close/:id', closeMaintenance);

// Fuel routes
router.route('/fuel-logs')
  .get(getFuelLogs)
  .post(createFuelLog);

// Expense routes
router.route('/expenses')
  .get(getExpenses)
  .post(createExpense);

module.exports = router;
