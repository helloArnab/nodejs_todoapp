import { User } from "../models/users.js"
import bcrypt from "bcrypt"
import { sendCookie } from "../utils/features.js"
import ErrorHandler from "../middlewares/error.js"

export const getMyProfile = (req,res)=>{
    try {

        res.status(200).json({
            success:true,
            user: req.user
        })  

    } catch (error) {
        next(error)
    }
}

export const register = async(req,res)=>{
    try {

        const {name,email,password} = req.body
    
        const user = await User.findOne({email})
    
        if(user) return next(new ErrorHandler("User Already Exist",404))
        
        const hashedPassword = await bcrypt.hash(password,10)    
    
        const newUser = await User.create({name,email,password:hashedPassword})
    
        sendCookie(newUser,res,"Registered Successfully",201)

    } catch (error) {
        next(error)
    }

}

export const login = async(req,res,next) => {
    try {
        
        const {email,password} = req.body
    
        const user = await User.findOne({email}).select("+password")
    
        if(!user) return next(new ErrorHandler("Invalid username or password",400))
        
        const isMatch = await bcrypt.compare(password,user.password)
    
        if(!isMatch) return next(new ErrorHandler("Invalid username or password",404))
        
        sendCookie(user,res,`Welcome back, ${user.name}`,200)

    } catch (error) {
        next(error)
    }

}

export const logout = async(req,res) => {
    try {

        res
            .status(200)
            .cookie("token","",{
                expires: new Date(Date.now()),
                sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
                secure: process.env.NODE_ENV === "Development" ? false : true,
            })
            .json({
                success:true,
            })
        
    } catch (error) {
        next(error)
    }
}