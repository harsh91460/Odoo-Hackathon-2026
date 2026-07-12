import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true
    },

    registrationNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
    },

    model: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["Truck", "Van", "Mini Truck"],
        required: true
    },

    maxLoadCapacity: {
        type: Number,
        required: true
    },

    odometer: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["Available", "On Trip", "In Shop", "Retired"],
        default: "Available"
    }
}, { timestamps: true });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;

