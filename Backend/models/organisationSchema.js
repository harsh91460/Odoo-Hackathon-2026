import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    safetyOfficers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    dispatchers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    financialAnalysts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    location: {
        type: String,
        required: true
    },

    invitedUsers: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            role: {
                type: String,
                enum: [
                    "Fleet Manager",
                    "Dispatcher",
                    "Safety Officer",
                    "Financial Analyst"
                ],
                required: true
            }
        }
    ]
}, { timestamps: true });

export default mongoose.model("Organization", organizationSchema);