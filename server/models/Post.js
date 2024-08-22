import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: String,
    firstName: { type: String, required: true, min:2, max: 100 }, // firstName: String,
    lastName: { type: String, required: true, min:2, max: 100 }, // lastName: String,
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
        type: Map,
        of: Boolean
    },
    comments: {
        type: Array,
        default: []
    }  
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post