// import dotenv from "dotenv";
// import dotenv from "dotenv";
import connectDB from "./db/connection.js";
import { app } from "./app.js";

// dotenv.config({
//     path: "./env"
// });

// Better approach
connectDB()
.then(() => {
    app.on("error", (error) => {
        console.error(`SERVER ERROR:\n${error}`);
    });

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server running on port: ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.error(`ERROR: MongoDB connection failed:\n ${err}`);
});


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