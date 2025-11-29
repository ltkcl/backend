import { mongoose, Schema } from "mongoose";
const userSchema = new mongoose.Schema(
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
userSchema.pre("save", async function (next) {
        if(!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password,10);
        next;
});
userSchema.methods.isPasswordCorrect = async function (password) {
        return await bcrypt.compare(password,this.password);
}
userSchema.method.generateAccessToken= function(){
  return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    fullname: this.fullName
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  }
)
};
userSchema.method.generateRefreshToken= function(){
  return jwt.sign({
    _id: this._id,    
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  }
)
};
export const User = new mongoose.model("User", userSchema);
