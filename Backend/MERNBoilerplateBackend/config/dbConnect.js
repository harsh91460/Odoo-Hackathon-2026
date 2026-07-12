import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("DB Connected");
        });

        await mongoose.connect(`${process.env.DATABASE_URI}/OdooHack`);
    } catch (err) {
        console.error("Error in db connection\n", err.message);
        process.exit(1);
    }
};