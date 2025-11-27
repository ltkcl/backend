import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/users.model";
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
    if(username){
        throw new ApiError(409,"User with email or username already exists")
    }
 })
export {registerUser};