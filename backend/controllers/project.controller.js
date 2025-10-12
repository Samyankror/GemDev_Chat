import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";
import * as projectService from "../services/project.service.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return next(errorHandler(400, firstError.msg));
  }

  try {
    const { name, description } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = loggedInUser._id;
    const newProject = await projectService.createProject({
      name,
      description,
      userId,
    });
    return res.status(201).json({ success: true, newProject });
  } catch (error) {
    next(error);
  }
};

export const getAllProject = async (req, res,next) => {
  try {
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const allProjects = await projectService.getAllProjectByUserId({
      userId: loggedInUser.id,
    });

    return res.status(200).json({ success: true, projects: allProjects });
  } catch (error) {
    next(error);
  }
};

export const addUserToProject = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return next(errorHandler(400, firstError.msg));
  }

  try {
    const { projectId, users } = req.body;

    const loggedInUser = await userModel.findOne({ email: req.user.email });

    const project = await projectService.addUsersToProject({
      projectId,
      users,
      userId: loggedInUser.id,
    });
    return res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const project = await projectService.getProject({ projectId });

    return res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

export const updateFileTree = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errros: errors.array() });
  }

  try {
    const { projectId, fileTree } = req.body;

    const project = await projectService.updateFileTree({
      projectId,
      fileTree,
    });

    return res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

export const removeUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return next(errorHandler(400, firstError.msg));
  }
  try {
    const { projectId, userId } = req.body;
    const { message } = await projectService.removeUser({ projectId, userId });
    return res.status(200).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};
