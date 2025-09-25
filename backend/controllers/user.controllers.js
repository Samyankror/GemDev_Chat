import userModel from "../models/user.model.js";
import * as userService from "../services/user.services.js";
import {validationResult} from 'express-validator'; 
import { errorHandler } from "../utils/errorHandler.js";
import jwt from 'jsonwebtoken';

export const createUserController = async(req,res,next)=>{
         
    const errors = validationResult(req);

    
       if (!errors.isEmpty()) {
  const firstError = errors.array()[0]; 
  return  next(errorHandler(400,firstError.msg ))
}
         
    try{ 
        const user = await userService.createUser(req.body);
        const {accessToken, refreshToken}  = await user.generateAccessandRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
        const {password:_password,__v,...safeUser} = user._doc;
       return res.status(201)
         .cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
        .json({success:true,user: safeUser});
    }catch(error){
        next(error);
    }
}


export const loginController = async(req,res,next)=>{
     const errors = validationResult(req);

     if(!errors.isEmpty()){
        const firstError = errors.array()[0]; 
       return  next(errorHandler(400,firstError.msg ))
     }

     try{
        const {email,password} = req.body;
        
        const user = await userModel.findOne({email})
       
        if(!user){
            return next(errorHandler(401,'Invalid credentials'))
        }
         
        const isMatch = await user.isValidPassword(password);
        
        if(!isMatch){
           return next(errorHandler(401,'Invalid credentials'))
        }
         const {accessToken, refreshToken}  = await user.generateAccessandRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
         const {password:_password,__v,...safeUser} = user._doc;
       return res.status(201)
         .cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
        .json({success:true,user: safeUser});
    }catch(error){
        next(error);
    }
}



export const profileController = async(req,res)=>{
    return res.status(200).json(req.user);
}

export const logoutController = async(req,res,next)=>{
    try{
        
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
       return res
      .status(200)
      .clearCookie('accessToken', { httpOnly: true })
      .clearCookie('refreshToken',{ httpOnly: true })
      .json({success:true,message : "user logout successfully"});
      
    } catch(error){
        next(error);
    }
}

export const generateNewAccessToken= async(req,res,next)=>{
     const incomingRefreshToken = req.cookies.refreshToken;
      if (!incomingRefreshToken) {
    return next(errorHandler(401, "unauthorized request"));
  }

  try{
     const decodedToken = jwt.verify(incomingRefreshToken,process.env.JWT_SECRET)
     const user = await userModel.findOne({email:decodedToken?.email});
    
       if (!user) {
      return next(errorHandler(401, "Invalid refresh token"));
    }
      console.log(incomingRefreshToken,user.refreshToken);
    if(incomingRefreshToken!==user.refreshToken){
        return next(errorHandler(401, "refresh token is expired or used"));
    }
    
        const {accessToken, refreshToken}  = await user.generateAccessandRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
       return res.status(200)
         .cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
        .json({success:true, message: "Access token refreshed",});
    }catch(error){
        next(error);
    }
}



export const  getAllUserController = async(req,res,next)=>{
     try{
        const loggedInUser  = await userModel.findOne({email:req.user.email});
       
        const allUsers = await  userService.getAllUsers({userId: loggedInUser.id});
         
        return res.status(200).json({success:true,allUsers});
     }
     catch(error){
        next(error);
     }
}