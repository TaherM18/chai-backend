import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// #region generateAccessAndRefreshToken 
async function generateAccessAndRefreshTokens(userId) {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {accessToken, refreshToken};
    } catch (error) {

    }
}
// #endregion

// #region registerUser
export const registerUser = asyncHandler( async function(req, res) {

    console.log("\nDEBUG: Request Body:\n", JSON.stringify(req.body));
    console.log("\nDEBUG: Request Files:\n", JSON.stringify(req.files));

    const keys = ["username", "email", "fullname", "password"];

    if (!req.body || Object.keys(req.body).some((field) => !keys.includes(field))) {
        throw new ApiError(400, "Request body empty or does not contain required fields");
    }

    const { username, email, fullname, password } = req.body;

    if ( [username, email, fullname, password].some((field) => field?.trim() === "") ) {
        throw new ApiError(400, "One or required fields is empty");
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with username or email already exists");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar image");
    }

    const createdUser = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    });

    const foundUser = await User.findById(createdUser._id).select("-password -refreshToken");

    if (!foundUser) {
        throw new ApiError(500, "Failed to create user");
    }

    res.status(201).json(
        new ApiResponse(201, foundUser, "User created successfully")
    );
});
// #endregion

// #region loginUser
export const loginUser = asyncHandler(async function (req, res) {
    const { username, email } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Either username or email is empty");
    }
    if (!password) {
        throw new ApiError(400, "password is required");
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.checkIsPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    delete user.password;

    const cookieOptions = {
        httpOnly: true,
        secure: true
    };

    res.status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(
        200,
        { user, accessToken, refreshToken }, 
        "Login successful"
    ));
});
// #endregion

// #region logoutUser 
export const logoutUser = asyncHandler(async function (req, res) {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {
            new: true
        }
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out sucessfully"));
});
// #endregion

//#region refreshAccessToken
export const refreshAccessToken = asyncHandler(async function (req, res) {
    const receivedRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

    if (!receivedRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedData = jwt.verify(receivedRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        console.debug("\nDEBUG: decodedData:\n",decodedData);
    
        const foundUser = User.findById(decodedData._id);
    
        if (!foundUser) {
            throw new ApiError(401, "Invalid token");
        }
    
        // if (receivedRefreshToken !== foundUser?.refreshToken) {
        //     throw new ApiError(401, "Token is expired");
        // }
    
        const cookieOptions = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(foundUser._id);
    
        return res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200, 
                {
                    accessToken,
                    refreshToken,
                },
                "Token assigned succssfully"
            )
        );
    } catch (error) {
        throw new ApiError(401,"Token is invalid or expired");
    }
});
// #endregion

// #region changePassword
export const changePassword = asyncHandler( async function (req, res) {
    if (!req.user) {
        throw new ApiError(400, "Unauthorized request");
    }

    const user = req.user;

    const { currentPassword, newPassword } = req.body;

    const isPasswordCorrect = user.checkIsPasswordCorrect(currentPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Current password is incorrect");
    }

    // validate new password
    const passRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\\w\\W]{8}/;
    if (!newPassword || passRegex.match(newPassword)) {
        throw new ApiError(301, "New password is empty or does not fulfill the validation requirements");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res.status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});
// #endregion

// #region getCurrentUser
export const getCurrentUser = asyncHandler( async function (req, res) {
    return res.status(200)
    .json(new ApiResponse(200, { user: req.user }, "User found successfully"));
});
// #endregion

// #region changeAvatar
export const changeAvatar = asyncHandler(async function (req, res) {
    // receive file from multer middleware
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(301, "Avatar image is missing");
    }
    // receive user from auth middleware
    const user = req.user;

    const avatarObj = await uploadToCloudinary(avatarLocalPath);

    if (!avatarObj) {
        throw new ApiError(500, "Failed to upload avatar image");
    }

    user.avatar = avatarObj.url;

    await user.save({ validateBeforeSave: false });
});
// #endregion

// #region getUserChannelProfile
export const getUserChannelProfile = asyncHandler(async function (req, res) {
    const {username} = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "Username is required");
    }

    const channel = User.aggregate([
        {
            $match: { username: username.toLowerCase() }
        },
        {
            $lookup: {
                from: "Subscription",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "Subscription",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscriberCount: { $size: "$subscribers" },
                subscribedToCount: { $size: "$subscribedTo" },
                isSubscribed: { 
                    $cond: {
                        if: { $in: [ req.user?._id, "$subscribers.subscriber" ] },
                        then: true,
                        else: false
                    } 
                }
            }
        },
        {
            $project: {
                username: 1,
                fullname: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                createdAt: 1,
                subscriberCount: 1,
                subscribedToCount: 1
            }
        }
    ]);

    if (!channel?.length) {
        throw new ApiError(404, "Channel not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "User profile data fetched successfully"));
});
// #endregion

//#region getWatchHistory
export const getWatchHistory = asyncHandler(async function (req, res) {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Schema.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "Video",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "User",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    // inner pipeline alternative
                    // {
                    //     $project: {
                    //         username: 1,
                    //         email: 1,
                    //         avatar: 1
                    //     }
                    // }
                    {
                        $addFields: {
                            owner : {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        },
        // {
        //     $project: {
        //         watchHistory: 1
        //     }
        // },
        // {
        //     $addFields: {
        //         watchHistory: {
        //             $first: "$watchHistory"
        //         }
        //     }
        // }
    ]);

    return res
    .status(200)
    .json(new ApiResponse(200, user[0].watchHistory, "Watch history fetched successfully"));
});
// #endregion