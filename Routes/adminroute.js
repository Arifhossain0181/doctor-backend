import express from 'express';

import {addDoctor} from '../Controller/admincontroller.js';

import uPload from '../Middleware/multer.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor',uPload.single('image'),addDoctor)

export default adminRouter;