import { Schema } from "mongoose";
import mongoose from "mongoose";
import { User } from "./users.model";
const subscriptionSchema = new Schema({
    subscriber :{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel :{
        type:Schema.Types.ObjectId,
        ref : User
    },      
},{timestamps :true});
export const Subscription = new mongoose.model("Subscription",subscriptionSchema);  