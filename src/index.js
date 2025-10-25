import pkg from 'dotenv';
const dotenv = pkg;
import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
import express from "express";
import connectDB from "./db/index.js"
dotenv.config({
    path: './env'
})
const app = express();
 connectDB()
 .then(()=>{
       app.listen(process.env.PORT||8000,()=>{
            console.log(`The server is running at ${process.env.PORT} `);
       });
 })
 .catch((err)=>{
    console.log("MongoDB connection error !!",err);
 });