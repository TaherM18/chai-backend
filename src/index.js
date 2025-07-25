// import dotenv from "dotenv";
import connectDB from "./db/connection.js";

// dotenv.config({
//     path: "./env"
// });

// Better approach
connectDB();


// Initial approach
/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";

const app = express();

(connectDB)();

async function connectDB() {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
        app.on("error", (error) => {
            console.error("SERVER ERROR:",error);
        });

        app.listen(process.env.PORT, () => {
            console.log("Application is running on port:",process.env.PORT);
        });
    }
    catch (error) {
        console.error("DB ERROR:",error);
    }
}
*/