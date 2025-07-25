import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


async function connectDB () {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\nMongoDB connected! Host: ${connectionInstance.connection.host}\n`);
    }
    catch (error) {
        console.error("MONGO DB connection error:",error); 
        process.exit(1);
    }
}

export default connectDB;