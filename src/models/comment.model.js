import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: mongoose.Schema.Types.String,
            require: true
        },
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        },
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);