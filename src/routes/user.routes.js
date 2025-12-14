import { Router } from "express";
import { loggedOutUser, registerUser } from "../controlllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { loginUser } from "../controlllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { requestAccessToken } from "../controlllers/user.controller.js";
const routes = Router();

routes.post('/register',upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),registerUser);  
routes.route('/login').post(loginUser);
routes.route("/logout").post(verifyJWT,loggedOutUser) 
routes.route("/refresh-token").post(requestAccessToken)

export default routes;