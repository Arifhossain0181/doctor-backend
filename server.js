import express from 'express';
import cors from 'cors';
import  'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudnaring from './config/cloudnaring.js';
import adminRouter from './Routes/adminroute.js';
import doctorRouter from './Routes/doctorrute.js';
import userRouter from './Routes/Userroute.js';
import { doctorlist } from './Controller/doctorcontroller.js';
// connect to cloudnaring
connectCloudnaring();

// connect to database
connectDB();

// aPP config
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`\n🔵 ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// aPi endpoints
app.use('/api/admin', adminRouter);

app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

// localhose:5000/ 

app.get('/' ,(req,res) =>{
    res.status(200).send('Hello from Doctor-Portal Server');
})
app.listen(port, () => {
    console.log(`Doctor-Portal Server is running on port: ${port}`);
});