import express from 'express';
import authdoctor from '../Middleware/authdoctor.js';
import { doctorlist ,doctorlogin ,appointmentsdoctor} from '../Controller/doctorcontroller.js';

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorlist);
doctorRouter.post('/login', doctorlogin);
doctorRouter.get('/appointments',authdoctor, appointmentsdoctor);

export default doctorRouter;