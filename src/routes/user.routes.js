import { Router } from "express";
import { 
    loginUser, 
    registerUser, 
    logoutUser, 
    refreshAccessToken, 
    changePassword,
    changeAvatar,
    updateUserAccount,
    getUserChannelProfile,
    getCurrentUser,
    getWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(verifyJWT, logoutUser);

userRouter.route("/refresh-token").post(refreshAccessToken);

userRouter.route("/change-password").post(verifyJWT, changePassword);

userRouter.route("/save-avatar").patch(verifyJWT, upload.single("avatar"), changeAvatar);

userRouter.route("/account").get(verifyJWT, getCurrentUser);

userRouter.route("/update-account").patch(verifyJWT, updateUserAccount);

userRouter.route("/channel-profile/:username").get(verifyJWT, getUserChannelProfile);

userRouter.route("/watch-history").get(verifyJWT, getWatchHistory);


export default userRouter;