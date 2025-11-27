import express from "express";
import cookieParser from "cookie-parser";
import {cors} from "cors";
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential : true
}));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({ extended:true , limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());
// Routes import
import routes from "./routes/user.routes.js";
// Router decleration
app.use("/api/v1/users",routes);

module.exports = app; 

