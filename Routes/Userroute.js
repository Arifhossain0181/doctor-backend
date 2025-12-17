import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, bookAppointment, listAppointments } from '../Controller/Usercontoller.js';
import upload from '../Middleware/multer.js';
import { authuser } from '../Middleware/authuser.js';
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile', authuser, getUserProfile);
userRouter.get('/profile', authuser, getUserProfile);  // Alternative endpoint
userRouter.put("/update-profile", upload.single('image'), authuser, updateUserProfile);
userRouter.post("/book-appointment", authuser, bookAppointment);
userRouter.get("/my-appointments", authuser, listAppointments);


export default userRouter;