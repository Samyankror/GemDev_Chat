import projectModel from "../models/project.model.js";
import mongoose from "mongoose";
import { errorHandler } from "../utils/errorHandler.js";

export const createProject = async({name,userId})=>{
   if(!name){
    return errorHandler(400,'name is required')
   }

   if(!userId){
     return errorHandler(400,'User Id  is required')
   }
  
     const  project =  projectModel.create({name,users:[userId]});
     return project;
   }
   



export const getAllProjectByUserId = async({userId})=>{
  if(!userId){
     throw new Error("UserId is reuired");
  }

   const allUserProjects = await projectModel.find({users:userId});
   return allUserProjects;
   
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

}

export const getProject = async({projectId})=>{
  if(!projectId){
    throw new Error('projectId is required');
  }

  if(!mongoose.Types.ObjectId.isValid(projectId)){
      throw new Error('projectId is invalid');
  }
  
  const project = await projectModel.findOne({
              _id: projectId
              }).populate('users');
 
    return project;
      
}

export const updateFileTree = async({projectId,fileTree})=>{

     if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!fileTree) {
        throw new Error("fileTree is required")
    }

    const project = await projectModel.findByIdAndUpdate(
                {
                  _id: projectId
                },
                {
                  fileTree
                },{
                  new: true
                }
              )

              return project;
}