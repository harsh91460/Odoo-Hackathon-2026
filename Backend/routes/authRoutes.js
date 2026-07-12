import express from "express";
import { handleLogin, registerUser, verifyOTP } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", handleLogin);
authRouter.post("/verify-otp", verifyOTP);

export default authRouter;