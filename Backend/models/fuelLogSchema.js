import mongoose from "mongoose";

const fuelLogSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true
    },

    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true
    },

    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip"
    },

    fuelQuantity: {
        type: Number,
        required: true
    }, // Liters

    fuelCost: {
        type: Number,
        required: true
    },
}, { timestamps: true });

export default mongoose.model("FuelLog", fuelLogSchema);