import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
    cloud_name: "dfdpwwhhg",
    api_key: `${process.env.CLOUDINARY_API_KEY}`,
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
    secure: true,    
});

const uploadCloudinary = async(localFile)=>{
    try{
        console.log("cloud name :",process.env.cloud_name);
        if(!localFile) return null;
        const response = await cloudinary.uploader.upload(localFile,{
            resource_type: "auto"
        });
        console.log("The file is uploaded on cloudinary",response.url);
        return response;
        }        
    catch(err){
        fs.unlinkSync(localFile);
        console.log("error",err);
        return null;
    }
} 

export{uploadCloudinary}