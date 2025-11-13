import { Router } from "express";
import { getAllVideosForPlaylist } from "../controllers/playlist.controller";

const playlistRouter = Router();

playlistRouter.route("/playlist/:id", getAllVideosForPlaylist);

export default playlistRouter;
