import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
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

    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true
    },

    source: {
        type: String,
        required: true,
        trim: true
    },

    destination: {
        type: String,
        required: true,
        trim: true
    },

    cargoWeight: {
        type: Number,
        required: true
    },

    tripDistance: {
        type: Number,
        required: true
    }, // in KM

    status: {
        type: String,
        enum: [
            "Draft",
            "Dispatched",
            "Completed",
            "Cancelled"
        ],
        default: "Scheduled"
    }

}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);
