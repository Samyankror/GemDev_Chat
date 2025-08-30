import userModel from '../models/user.model.js'

export const createUser = async({email,password})=>{


    if(!email && !password){
        throw new Error('email and password is required')
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = userModel.create({email,password:hashedPassword});
    return user;
}

export const getAllUsers = async({userId})=>{
   
        const allUsers = await userModel.find(
            {_id :
                 { $ne: userId}
                });
        return allUsers;
    
}