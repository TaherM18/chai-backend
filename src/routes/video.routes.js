import { Router } from "express";
import {
    getAllVideos,
    getVideo,
    updateVideo,
    deleteVideo,
    setPublishStatus,
    uploadVideo,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const videoRouter = Router();

videoRouter.route("/all").get(getAllVideos);

videoRouter.route("/video/:id").get(getVideo);

videoRouter.route("/video").patch(verifyJWT, updateVideo);

videoRouter.route("/video/:id").delete(verifyJWT, deleteVideo);

videoRouter.route("/video/upload").post(
    verifyJWT, 
    upload.fields([
        {
            name: "video",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]), 
    uploadVideo);

export default { videoRouter };