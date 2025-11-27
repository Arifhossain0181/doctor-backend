import express from 'express';
import {authadmin} from '../Middleware/authadmin.js';
import {addDoctor ,loginadmin} from '../Controller/admincontroller.js';

import uPload from '../Middleware/multer.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor',authadmin,uPload.single('image'),addDoctor)
adminRouter.post('/login',loginadmin)

export default adminRouter;