import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true,
        },

        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
            index: true,
        },

        serviceName: {
            type: String,
            required: true,
            trim: true,
        },

        cost: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: ["in shop", "completed"],
            default: "in shop",
        },

        startingDate: {
            type: Date,
            default: Date.now,
        },

        endingDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

export default Maintenance;