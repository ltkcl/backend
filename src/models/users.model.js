import { mongoose, Schema } from "mongoose";
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      required: true,
    },
    email: {
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverimage: {
      type: String,  // cloudinary url  
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],    
    password: {
      type: String,
      required: [true," Password is Required"],
    },
    refreshtoken: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_At",
      updatedAt: "update_At",
    },
  }
);
export const User = new mongoose.model("User", userSchema);
