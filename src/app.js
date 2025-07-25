import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
};
const jsonOptions = {
    limit: "16KB",
};
const urlencodedOptions = {
    extended: true,
    limit: "16KB"
}

app.use(cors(corsOptions));
app.use(express.json(jsonOptions));
app.use(express.urlencoded(urlencodedOptions));
app.use(express.static("public"));
app.use(cookieParser());

export { app };