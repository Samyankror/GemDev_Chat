import userModel from '../models/user.model.js'
import { errorHandler } from '../utils/errorHandler.js';


export const createUser = async({username,email,password})=>{

    const hashedPassword = await userModel.hashPassword(password);
    const user = userModel.create({username,email,password:hashedPassword})
    return user;
}

export const updateUser = async({id,username,email,password})=>{
     if (!mongoose.Types.ObjectId.isValid(projectId)) {
             throw  errorHandler(400,'User Id is invalid')
       }
     
     if(password.length>=1 && password.length<6){
          throw  errorHandler(400,'Password must be at least 6 characters long')
     }
    

    try{
    const updateData = {
            username,
            email
        };

        if (password && password.length > 0) {
            updateData.password = await userModel.hashPassword(password);
        }

        const user = await userModel.findByIdAndUpdate(id, updateData, {
            new: true,
        });
         console.log(user);
        return user;

    } catch(error){
        return error
    }

}

export const getAllUsers = async({userId})=>{
   
        const allUsers = await userModel.find(
            {_id :
                 { $ne: userId}
                });
        return allUsers;
    
}

export const searchUser = async({username})=>{
    
    const users = await userModel.find({
        username : {
            $regex: username,
            $options: 'i' 
        }
    })
    return users
}