import { mongoose , Schema } from "mongoose";
const videoSchema = new Schema({
    videoFile:{
        type: String,// cloudinary
        required: true
    },
    thumbnail:{
        type: String, // cloudinary
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    duration:{
        type: Number,// cloudinary
        required: true
    },
    views:{
        type: String,
        default: 0
    },
    isPublished:{
        type: Boolean,
        required: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});
export const Video = new mongoose.model("Video",videoSchema);