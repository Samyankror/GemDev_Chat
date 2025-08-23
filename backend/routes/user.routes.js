import { Router } from "express";
import * as userController  from "../controllers/user.controllers.js";
import { body } from "express-validator";
import { authUser } from "../middleware/auth.middleware.js";


const router = Router();

router.post('/register',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({min: 3}).withMessage('Password must be at least 6 characters long'),
    userController.createUserController);

router.post('/login',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength().withMessage('Password must be at least 6 characters long'),
    userController.loginController);

router.post('/profile',authUser,userController.profileController);   


export default router;