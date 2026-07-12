import bcrypt from "bcrypt";
import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../services/authMail.js";
 
export const registerUser = async (req, res) => {
    try {
        console.log(req.body);
        const { fullName, email, password } = req.body;

        // Validate input
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        // If user exist but not verified then we update that column with new one and verify the email
        if (existingUser) {

            // User is already verified
            if (existingUser.isVerified) {
                return res.status(409).json({
                    success: false,
                    message: "User already exists."
                });
            }

            // User exists but is not verified
            const hashedPassword = await bcrypt.hash(password, 10);

            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            existingUser.fullName = fullName;
            existingUser.password = hashedPassword;
            existingUser.otp = otp;
            existingUser.otpExpiry = Date.now() + 10 * 60 * 1000;

            await existingUser.save();

            await sendOTPEmail(existingUser.email, otp);

            return res.status(200).json({
                success: true,
                message: "OTP Sent Successfully",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Create user
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            otp,
            otpExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes
        });

        // Send email
        await sendOTPEmail(email, otp);

        return res.status(201).json({
            success: true,
            message: "OTP Sent Successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// To verify the email otp
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired."
            });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;

        await user.save();

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                organizationId: user.organizationId,
                organizationInvitations: user.organizationInvitations,
                inviteAccepted: user.inviteAccepted
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                organizationId: user.organizationId,
                organizationInvitations: user.organizationInvitations,
                inviteAccepted: user.inviteAccepted
            },
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in."
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                organizationId: user.organizationId,
                organizationInvitations: user.organizationInvitations,
                inviteAccepted: user.inviteAccepted
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        // console.log(token); // for testing

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                organizationId: user.organizationId,
                organizationInvitations: user.organizationInvitations,
                inviteAccepted: user.inviteAccepted
            },
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const verifyUserToken = async (req, res) => {
    try {
      // 1️⃣ Read token from cookies
      const token = req.cookies?.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Authentication required verifyUserToken",
          navigate: "/login",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      // 2️⃣ Verify token

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token verifyUserToken",
          navigate: "/login",
        });
      }

      // 3️⃣ Attach user to request
      req.user = user;

      // 4️⃣ Continue
      return res.status(200).json({
        success: true,
        message: "Token is valid",
        user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                organizationId: user.organizationId,
                organizationInvitations: user.organizationInvitations,
                inviteAccepted: user.inviteAccepted
        },
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Authentication failed verifyUserToken",
        navigate: "/login",
      });
    }
  }