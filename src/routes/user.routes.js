import { Router } from "express";
import { registerUser } from "../controlllers/user.controller.js";
const routes = Router();


routes.route('/register').post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ])
    ,registerUser);
routes.route('/login').post(login);

export default routes;