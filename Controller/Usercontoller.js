import validator from 'validator';
import bcrypt from 'bcrypt';
import UserModel from '../Models/usermodel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

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
        const user = await newUser.save();

        // jwt token generation
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'1d'});
        res.status(201).json({success:true, message:"User registered successfully", token});
    }
    catch(error){
         console.error("User Registration Error:", error);
         res.status(500).json({success:false, message:"Internal Server Error", error: error.message});
    }
}

// API for user login can be added here similarly

const loginUser = async (req, res) => {
    console.log('========== USER LOGIN REQUEST ==========');
    console.log('Request body:', req.body);
    
    try{
        const {email, password} = req.body;
        
        console.log('Login attempt for email:', email);
        
        if(!email || !password){
            console.log('Missing fields');
            return res.status(400).json({success:false, message:"All fields are required"});
        }
        
        const user = await UserModel.findOne({email});
        
        if(!user){
            console.log('User not found:', email);
            return res.status(401).json({success:false, message:"User not found. Please register first."});
        }
        
        console.log('User found, comparing password');
        const ismatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', ismatch);
        
        if(ismatch){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'1d'});
            console.log('Login successful for:', email);
            return res.json({success:true, message:"User logged in successfully", token});
        }
        else{
            console.log('Invalid password for:', email);
            return res.status(401).json({success:false, message:"Invalid password"});
        }
    }
    catch(error){
            console.error("User Login Error:", error);
            res.status(500).json({success:false, message:"Internal Server Error", error: error.message});
    }
}

// aPI to user PRofile data 

const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const userdata = await UserModel.findById(userId).select('-password -__v');
        if (!userdata) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: userdata });
    }
    catch (error) {
        console.error("Get User Profile Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

//API update user profile
const updateUserProfile = async (req, res) => {
    try{
        const userId = req.userId;
        const { name, address, dob, gender, phone } = req.body;
        const imagefile = req.file;

        if(!name || !phone || !dob || !gender){
            return res.json({success:false, message:"All data missing"});
        }
        
        const updateData = { name, address, dob, gender, phone };
        
        if(imagefile){
            // Upload image to cloudinary if provided
            const uploadedImg = await cloudinary.uploader.upload(imagefile.path, {
                resource_type: "image",
                folder: "users"
            });
            updateData.image = uploadedImg.secure_url;
        }
        
        await UserModel.findByIdAndUpdate(userId, updateData);
        res.json({success:true, message:"Profile updated successfully"});
    }
    catch (error) {
        console.error("Update User Profile Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }   
}

export { registerUser, loginUser, getUserProfile, updateUserProfile };