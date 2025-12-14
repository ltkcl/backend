import dotenv from 'dotenv';
dotenv.config({
    path: '.env',
    debug: 'true'
});
import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
import express from "express";
import connectDB from "./db/index.js"
import app from './app.js';
 connectDB()
 .then(()=>{
       app.listen(process.env.PORT||8000,()=>{
            console.log(`The server is running at ${process.env.PORT} `);
       });
 })
 .catch((err)=>{
    console.log("MongoDB connection error !!",err);
 }); 