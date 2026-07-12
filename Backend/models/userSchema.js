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
        enum: ["user", "admin"],
        default: "user"
    },

    isVerified: {
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