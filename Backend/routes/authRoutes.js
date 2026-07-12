import express from "express";
import { handleLogin, registerUser, verifyOTP,verifyUserToken } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", handleLogin);
authRouter.post("/verify-otp", verifyOTP);
authRouter.get("/verify-token", verifyUserToken);

export default authRouter;