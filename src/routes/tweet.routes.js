import { Router } from "express";
import { getAllTweets } from "../controllers/tweet.controller";

const tweetRouter = Router();

tweetRouter.route("/tweets/:id", getAllTweets);

export default tweetRouter;
