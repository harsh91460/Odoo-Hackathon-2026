const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required'],
    },
    type: {
      type: String,
      required: [true, 'Expense type is required'],
      trim: true,
    },
    cost: {
      type: Number,
      required: [true, 'Expense cost is required'],
    },
    date: {
      type: String,
      required: [true, 'Expense date is required'],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
