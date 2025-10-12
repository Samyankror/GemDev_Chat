import { Router } from "express";
import * as userController from "../controllers/user.controllers.js";
import { body } from "express-validator";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  body("username").trim().isString().notEmpty().withMessage("username must be valid"),
  body("email").trim().isEmail().withMessage("Email must be a valid email address"),
  body("password")
     .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  userController.createUserController
);

router.post(
  "/login",
  body("email").trim().isEmail().withMessage("Email must be a valid email address"),
  body("password")
     .trim()
     .notEmpty()
    .withMessage("Password is required"),
  userController.loginController
);

router.put(
  "/update-profile",
  authUser,
  body("username").trim().isString().notEmpty().withMessage("username must be valid"),
  body("email").trim().isEmail().withMessage("Email must be a valid email address"),
  userController.profileController
);

router.post("/logout", authUser, userController.logoutController);

router.get("/all", authUser, userController.getAllUserController);
router.get("/getAccess", userController.generateNewAccessToken);
router.get("/search", authUser, userController.search);

export default router;
