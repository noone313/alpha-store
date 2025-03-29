import { Router } from 'express';
import { login,register,get_register, get_login } from '../controller/user.controller.js';
import { registerValidationRules } from "../validations/register.validation.js";
import { uploadUserImage } from '../middleware/upload.js';

const userRouter = Router();



userRouter.get('/register', get_register);
userRouter.post('/register',uploadUserImage.single('userImage'),registerValidationRules,register);

userRouter.get("/login",get_login)
userRouter.post('/login',login);


export { userRouter };