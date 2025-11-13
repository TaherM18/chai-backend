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

// Middlewares

app.use(cors(corsOptions));
app.use(express.json(jsonOptions));
app.use(express.urlencoded(urlencodedOptions));
app.use(express.static("public"));
app.use(cookieParser());

// Routes Import

import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import tweetRouter from "./routes/tweet.routes.js";

// Routes Declaration

app.use("/api/v1/user", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/tweet", tweetRouter);

export { app };