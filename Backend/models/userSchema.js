import mongoose from "mongoose";

const userSchema  = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: [true, "Password is required"],
    },

    role: {
        type: String,
        enum: [
            "User",
            "Fleet Manager",
            "Dispatcher",
            "Safety Officer",
            "Financial Analyst"
        ],
        default: "User"
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        default: null,
        index: true
    },

    organizationInvitations: [
        {
            organizationId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Organization",
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
    ],

    inviteAccepted: {
        type: Boolean,
        default: false
    },

    otp: {
        type: String,
    },

    otpExpiry: {
        type: Date,
    },
    
}, {timestamps: true})

const User = mongoose.model("User", userSchema);

export default User;