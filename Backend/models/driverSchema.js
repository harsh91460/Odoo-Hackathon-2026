import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    licenseCategory: {
      type: String,
      required: true,
      enum: [
        "Permanent",
        "Commercial",
        "International",
      ],
    },

    licenseExpiryDate: {
      type: Date,
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },

    safetyScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "Available",
        "On trip",
        "Off duty",
        "Suspended",
      ],
      default: "Available",
    },

    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Drive = mongoose.model("Driver", driverSchema);

export default Drive;