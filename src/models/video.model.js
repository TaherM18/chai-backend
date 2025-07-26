import mongoose from "mongoose";

const videoSchema = mongoose.Schema(
    {
        videoFile: {
            type: String,   // cloudinary url
            required: true,
        },
        thumbnail: {
            type: String,   // cloudinary url
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tile: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        duration: {
            type: Number,
            required: true,
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            required: true,
            default: true,
        }
    },
    {
        timestamps: true
    }
);

export const Video = mongoose.model("Video", videoSchema);