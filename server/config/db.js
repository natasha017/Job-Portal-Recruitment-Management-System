import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connectDb = async () => {
    try {
       await mongoose.connect(MONGODB_URI);
       console.log("Database Connected Successfully");
    } catch (error) {
        console.error("Database Connection Failed:", error.message);
        throw error;
    }
};

export default connectDb;
