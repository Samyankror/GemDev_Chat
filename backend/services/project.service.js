import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async({name,userId})=>{
   if(!name){
    throw new Error('Name is required');
   }

   if(!userId){
     throw new Error('UserId is required');
   }
   try{
     const  project =  projectModel.create({name,users:[userId]});
     return project;
   }
   catch(error){
    throw error;
   }

}

export const getAllProjectByUserId = async({userId})=>{
  if(!userId){
     throw new Error("UserId is reuired");
  }

   try{
   const allUserProjects = await projectModel.find({users:userId});
   return allUserProjects;
   } catch(error){
     throw error;
   }
}

export const addUsersToProject = async({projectId,users,userId})=>{
     if(!projectId){
      throw new Error('projectId is required');
     }
       if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!users) {
        throw new Error("users are required")
    }
  

    if(!Array.isArray(users) || users.some(userid=> !mongoose.Types.ObjectId.isValid(userid))){
      throw new Error('Invalid userId(s) in users array');
    }
      if(!userId){
        throw new Error('userId is required');
      }
      if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new Error('Invalid userId');
      }
       try{
         
      const project = await projectModel.findOne({_id:projectId, users : userId});
      if(!project){
        throw new Error('User does not belong to that project')
      }
         const updatedProject = await projectModel.findByIdAndUpdate({
            _id: projectId
         },
         {
          $addToSet:{
               users :{
              $each: users
               }
          },
         },
         {
          new:true
         })
         return updatedProject;
       }catch(error){
        throw error;
       }
}