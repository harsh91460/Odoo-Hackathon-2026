const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    regNo: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Vehicle name/model is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Vehicle type is required'],
      enum: ['Van', 'Heavy Truck', 'Light Truck', 'Sedan'],
    },
    maxCapacity: {
      type: Number,
      required: [true, 'Maximum load capacity is required'],
    },
    odometer: {
      type: Number,
      required: [true, 'Odometer reading is required'],
    },
    acquisitionCost: {
      type: Number,
      required: [true, 'Acquisition cost is required'],
    },
    status: {
      type: String,
      enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
      default: 'Available',
    },
    region: {
      type: String,
      enum: ['North', 'South', 'East', 'West'],
      default: 'North',
    },
    revenue: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
