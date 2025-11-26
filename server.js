import express from 'express';
import cors from 'cors';
import  'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudnaring from './config/cloudnaring.js';
import adminRouter from './Routes/adminroute.js';

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

// aPi endpoints
app.use('/api/admin', adminRouter);
// localhose:5000/ 

app.get('/' ,(req,res) =>{
    res.status(200).send('Hello from Doctor-Portal Server');
})
app.listen(port, () => {
    console.log(`Doctor-Portal Server is running on port: ${port}`);
});