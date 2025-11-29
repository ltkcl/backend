import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
 const registerUser = asyncHandler( async (req,res)=>{
    const {fullname,email,username,password} = req.body; 
    if([fullname,email,username,password].some((field1)=>{
        field1?.trim ===""
    })){
        throw new ApiError(400,"All fields are required");
    }               
    const existedUser = User.findOne({
        $or:[{username},{email}] 
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
    }    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required ");
    }
    console.log(req.files);
    const avatar = await uploadCloudinary(avatarLocalPath);
    const coverImage = await uploadCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiError(400,"Avatar is required")
    }  
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    const createUser = await User.findById(user._id);
    if(!createUser){
        throw new ApiError(500,"Something went wrong while registering the user");
    }
    return res.status(201).json(
        new ApiResponse(200,createUser,"User registered successfully ")
    );
 })
export {registerUser};