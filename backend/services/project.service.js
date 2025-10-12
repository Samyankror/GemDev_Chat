import projectModel from "../models/project.model.js";
import mongoose from "mongoose";
import { errorHandler } from "../utils/errorHandler.js";


export const createProject = async ({ name, description, userId }) => {
  
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw  errorHandler(400,"User Id  is invalid")
  }

  const project = await projectModel.create({ name, description, users: [userId] });
  return project;
};

export const getAllProjectByUserId = async ({ userId }) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
     throw  errorHandler(400,"User Id  is invalid")
  }

  const allUserProjects = await projectModel.find({ users: userId });
  return allUserProjects;
};

export const addUsersToProject = async ({ projectId, users, userId }) => {
  
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
     throw  errorHandler(400,"Invalid projectId")
  }

  if (
    !Array.isArray(users) ||
    users.some((userid) => !mongoose.Types.ObjectId.isValid(userid))
  ) {
    throw  errorHandler(400,"Invalid userId(s) in users array")
  }
  
  if (!mongoose.Types.ObjectId.isValid(userId)) {
       throw  errorHandler(400,"User Id  is invalid")
  }

  const project = await projectModel.findOne({ _id: projectId, users: userId });
  if (!project) {
     throw  errorHandler(404,"User does not belong to that project")
    
  }
  const updatedProject = await projectModel.findByIdAndUpdate(
    {
      _id: projectId,
    },
    {
      $addToSet: {
        users: {
          $each: users,
        },
      },
    },
    {
      new: true,
    }
  );
  return updatedProject;
};

export const getProject = async ({ projectId }) => {
  

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
       throw  errorHandler(400,"Invalid projectId")
  }

  const project = await projectModel
    .findOne({
      _id: projectId,
    })
    .populate("users");

  return project;
};

export const updateFileTree = async ({ projectId, fileTree }) => {
 

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw  errorHandler(400,"Invalid projectId")
  }

  const project = await projectModel.findByIdAndUpdate(
    {
      _id: projectId,
    },
    {
      fileTree,
    },
    {
      new: true,
    }
  );

  return project;
};

export const removeUser = async ({ projectId, userId }) => {
  

  if(!mongoose.Types.ObjectId.isValid(projectId)) {
       throw  errorHandler(400,"Invalid projectId")
  }
  

  if(!mongoose.Types.ObjectId.isValid(userId)) {
     throw  errorHandler(400,'User Id is invalid')
  }

  const project = await projectModel.findByIdAndUpdate(
    {
      _id: projectId,
    },
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  );
  if (project && project.users.length === 0) {
      await project.deleteOne();
  }
  return { message: "Successfuly left the group" };
};
