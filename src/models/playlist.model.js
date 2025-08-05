import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
    {
        videos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: {
            type: mongoose.Schema.Types.String,
            require: true
        },
        description: {
            type: mongoose.Schema.Types.String,
            require: true
        },
    }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);