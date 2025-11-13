import { Video } from "../models/video.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const getAllVideos = asyncHandler(async function (req, res) {

});

export const getVideo = asyncHandler(async function (req, res) {
    
});

export const updateVideo = asyncHandler(async function (req, res) {
    
});

export const deleteVideo = asyncHandler(async function (req, res) {
    
});

export const setPublishStatus = asyncHandler(async function (req, res) {
    
});

export const uploadVideo = asyncHandler(async function (req, res) {
    const videoLocalPath = req.files?.video?.[0].path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0].path;
    const { title, description } = req.body;

    if (!req.user) {
        throw new ApiError(401, "Unauthorized request");
    }

    if (!title || !description) {
        throw new ApiError(400, "Video title and description are required");
    }

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video and thumbnail is required");
    }

    const videoObj = await uploadToCloudinary(videoLocalPath);
    const thumbnailObj = await uploadToCloudinary(thumbnailLocalPath);

    if (!videoObj) {
        throw new ApiError(500, "Failed to upload video");
    }
    if (!thumbnailObj) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }

    const createdVideo = await Video.create({
        videoFile: videoObj.url,
        thumbnail: thumbnailObj.url,
        duration: videoObj.duration,
        owner: req.user._id
    });

    return res
    .status(201)
    .json(new ApiResponse(201, createdVideo, "Video uploaded successfully"));
});