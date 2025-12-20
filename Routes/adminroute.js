import express from 'express';
import {authadmin} from '../Middleware/authadmin.js';
import {addDoctor ,loginadmin ,allAppointmentsadmin} from '../Controller/admincontroller.js';
import { changeavilability } from '../Controller/doctorcontroller.js';

import uPload from '../Middleware/multer.js';
import { allDoctors } from '../Controller/admincontroller.js';

const adminRouter = express.Router();

// Add error handling for multer errors
adminRouter.post('/add-doctor', authadmin, (req, res, next) => {
    uPload.single('image')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File size too large. Maximum 5MB allowed.'
                });
            }
            if (err.message === 'Only image files are allowed!') {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            // For unexpected field error
            return res.status(400).json({
                success: false,
                message: `Upload error: File field must be named "image". Error: ${err.message}`
            });
        }
        next();
    });
}, addDoctor);

adminRouter.post('/login',loginadmin)

adminRouter.get('/all-doctors', authadmin, allDoctors);
adminRouter.post('/change-availability', authadmin, changeavilability);
adminRouter.get('/appointments', authadmin, allAppointmentsadmin);


export default adminRouter;