import express from "express";

import authRouter from "./authRoutes.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import userRouter from "./userRoutes.js";
import invitationRouter from "./invitationRoutes.js";
import organizationRouter from "./organizationRoutes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use('/user', /* verifyJWT, */ userRouter); // enable verifyJWT later
router.use('/invitation', verifyJWT, invitationRouter);
router.use('/organization', verifyJWT, organizationRouter);

export default router;