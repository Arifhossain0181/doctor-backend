import validator from 'validator';
import bcrypt from 'bcryptjs';
import UserModel from '../Models/usermodel.js';
import jwt from 'jsonwebtoken';

// API to register user

const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({success:false, message:"All fields are required"});
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({success:false, message:"Invalid email format"});
        }
        if(password.length < 6){
            return res.status(400).json({success:false, message:"Password must be at least 6 characters"});
        }

        // validations passed, hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const usrData = 
        {name,

             email, 
             password: hashedPassword

        };
        const newUser = new UserModel(usrData);
     const user =   await newUser.save();

     // jwt token generation
     const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'1d'});
     res.json({success:true, message:"User registered successfully", token});

      
        res.status(201).json({success:true, message:"User registered successfully"});
    }
    catch(error){
         console.error("User Registration Error:", error);
         res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

// API for user login can be added here similarly

const loginUser = async (req, res) => {
    try{

        const {email, password} = req.body;
        const user = await UserModel.findOne({email})
        if(!email || !password){
            return res.status(400).json({success:false, message:"All fields are required"});
        }
        const ismatch = await bcrypt.compare(password, user.password);
        if(!ismatch){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'1d'});
            return res.json({success:true, message:"User logged in successfully", token});
        }
        else{
            return res.status(401).json({success:false, message:"Invalid credentials"});
        }
    }
    catch(error){
            console.error("User Login Error:", error);
            res.status(500).json({success:false, message:"Internal Server Error"});
    }
}


export { registerUser, loginUser };