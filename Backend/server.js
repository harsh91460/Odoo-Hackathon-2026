import "dotenv/config";
import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';
import router from './routes/index.js';
import { connectDB } from './config/dbConnect.js';
import { corsOptions } from './config/corsOptions.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api', router);

mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})