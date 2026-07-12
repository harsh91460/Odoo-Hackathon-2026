import express from "express";

import authRouter from "./authRoutes.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import userRouter from "./userRoutes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use('/user', /* verifyJWT, */ userRouter); // enable verifyJWT later

export default router;