import { Router } from "express";
import { authUser } from '../middleware/auth.middleware.js'
import { body } from "express-validator";
import * as projectController from '../controllers/project.controller.js'
const router = Router();
router.post(
  "/create",
  authUser,
  body("name").isString(),
  projectController.createProject
);

router.get("/all", authUser, projectController.getAllProject);
router.put(
  "/add-user",
  authUser,
  body("projectId").isString().withMessage("Project Id is required"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("User must be an array of String"),
  projectController.addUserToProject
);
router.get(
  "/get-project/:projectId",
  authUser,
  projectController.getProjectById
);

export default router;
