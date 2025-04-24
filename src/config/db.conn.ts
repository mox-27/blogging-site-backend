import mongoose from "mongoose";

export const connectDB = async () => {

    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI as string}`);
    } catch (error) {
        console.log("Failed to connect: ", error);

    }
}