const mongoose = require('mongoose');

const fuelLogSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required'],
    },
    liters: {
      type: Number,
      required: [true, 'Liters consumed is required'],
    },
    cost: {
      type: Number,
      required: [true, 'Fuel cost is required'],
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FuelLog', fuelLogSchema);
