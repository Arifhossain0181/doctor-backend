import express from 'express';
import { doctorlist } from '../Controller/doctorcontroller.js';

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorlist);

export default doctorRouter;