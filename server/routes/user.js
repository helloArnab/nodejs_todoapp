import express from "express";
import {User} from "../models/users.js";
import { 
    getMyProfile, 
    login,
    logout,
    register,  
} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/me",isAuthenticated,getMyProfile)

router.get("/logout",logout)

router.post("/new",register)

router.post("/login",login)

export default router;