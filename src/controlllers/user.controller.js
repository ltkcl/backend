import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'JsonWebTokenError';
import { JsonWebTokenError } from "jsonwebtoken";

const generateAccessTokenAndRefreshTokens =async(userId)=>{
    try{
        const user = User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false });    
    }catch(err){
        throw new ApiError(500,"Something went wrong while generating refresh token and access token");
    }
    return {refreshToken,accessToken}
};


 const registerUser = asyncHandler( async (req,res)=>{
    const {fullname,email,username,password} = req.body; 
    if([fullname,email,username,password].some((field1)=>{
        field1?.trim ===""
    })){
        throw new ApiError(400,"All fields are required");
    }               
    const existedUser = await User.findOne({
        $or:[{username},{email}] 
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists");
    }  
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;    
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required ");
    }
    
    const avatar = await uploadCloudinary(avatarLocalPath);
    const coverImage = await uploadCloudinary(coverImageLocalPath);
    console.log(avatar);
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
 const loginUser = asyncHandler(async (req,res)=>{
    const {email,username,password} = req.body;
if(!(username || email)){
    throw new ApiError(400,"Username or email is required");
}
if(!password){
    throw new ApiError(400,"Password is required"); 
}
const user  = await User.findOne({$or : [{username},{email}]});
if(!user){
    throw new ApiError(404,"The user do no exist");
 }
 const isPasswordValid = await user.isPasswordCorrect(password);
 if(!isPasswordValid){
    throw new ApiError(401,"Invalid user credentials");
 }
 const {accessToken,refreshToken} = await generateAccessTokenAndRefreshTokens(username._id);
 const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
 const option={
    httpOnly : true,
    secure : true
 }
 return res.status(200).cookie("accessToken",accessToken,option)
 .cookie("refreshToken",refreshToken,option)
 .json( new ApiResponse(200,{
    user : loggedInUser,accessToken,refreshToken
 },"User Logged In")) 
 })
 const loggedOutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $set :{
            refreshToken: undefined
        }   
    },{
            new : true
        }
    )
    const option ={
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken",option).clearCookie("refreshToken",option).json(200,{},"User logged out")
 });
 const requestAccessToken =asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorised Request");  
    }
    try {
        const decodeToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
        const user  = await User.findById(decodeToken?._id);
        if(!user){
            throw new ApiError(401,'Invalid refresh token');
        }
        if(incomingRefreshToken != user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired ore used");
        }   
        const option={
            httpOnly:true,
            secure:true
        }
        const {accessToken,newRefreshToken}=await generateAccessTokenAndRefreshTokens(user._id);
        return res
        .status(200)
        .cookie("accessToken",accessToken,option)
        .cookie("refeshToken",refreshToken,option)
        .json(
            new ApiResponse(
                200,
                {newRefreshToken,accessToken},
                "Access Token refreshed"
            )
        )
    } catch (error) {
            throw new ApiError(401, error?.message || 'Invalid Refresh Token')
    }
 });
 const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}= req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect){
         throw new ApiError(400,"Invalid old password");
    }    
    user.password = newPassword;
    user.save({validateBeforeSave:false});
    return res.status(200).json(
         new ApiResponse(200,{},"The password was changed Successfully")
        )
 }) 
 const getCurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200).json(200,req.req.user,"Current user fetched successfully");
 })
 const updateAccountDetails =asyncHandler(async(req,res)=>{
    const {fullname,email} = req.body;
    if(!fullname || !email){
        throw new ApiError(400,"Provide either the password or email"); 
    }
    const  user = User.findByIdAndUpdate(req.user?._id,{
        $set :{
            fullname : fullname,
            email:email,
        }
    },{
            new :true
        }).select("-password");
    return res.status(200).json(new ApiResponse(200,user,"Account details updated successfully"))    
 })
 return
export {registerUser,loginUser,loggedOutUser,requestAccessToken,getCurrentUser,changeCurrentPassword,updateAccountDetails};