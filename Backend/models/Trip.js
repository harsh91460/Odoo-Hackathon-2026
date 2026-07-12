const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: [true, 'Source location is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination location is required'],
      trim: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required'],
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Driver reference is required'],
    },
    cargoWeight: {
      type: Number,
      required: [true, 'Cargo weight is required'],
    },
    plannedDistance: {
      type: Number,
      required: [true, 'Planned distance is required'],
    },
    status: {
      type: String,
      enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
      default: 'Draft',
    },
    revenue: {
      type: Number,
      required: [true, 'Trip revenue is required'],
    },
    date: {
      type: String,
      required: [true, 'Trip date is required'],
    },
    odometerStart: {
      type: Number,
    },
    odometerEnd: {
      type: Number,
    },
    fuelConsumed: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Trip', tripSchema);
