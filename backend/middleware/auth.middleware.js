import jwt from 'jsonwebtoken'
import { errorHandler } from '../utils/errorHandler.js';

export const authUser = async(req,res,next)=>{
    try{
      
     const token = req.cookies.accessToken;
      
     if(!token){
        return next(errorHandler(401,'Unauthorized User'))
     }
      
     const decoded = jwt.verify(token,process.env.JWT_SECRET);
     req.user = decoded;
     next();
    }catch(error){
       return next(error)
    }

} 