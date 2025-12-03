import express from 'express';
import { registerUser, loginUser ,getUserProfile} from '../Controller/Usercontoller.js';
import { authuser } from '../Middleware/authuser.js';
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/get-profile',authuser, getUserProfile);

export default userRouter;