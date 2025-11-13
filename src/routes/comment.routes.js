import { Router } from "express";
import { getAllComments } from "../controllers/comment.controller";

const commentRouter = Router();

commentRouter.route("/comments/:videoId", getAllComments);

export default commentRouter;
