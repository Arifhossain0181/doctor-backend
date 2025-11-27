// API for adding doctor 
import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctormodel from '../Models/doctormodel.js';
 import jwt from 'jsonwebtoken';
const addDoctor = async (req, res) => {
    try {
        // Extract body values
        const {
            name,
            email,
            specialization,
            degree,
            experience,
            about,
            availability,
            fee,
            address,
            slots_booked,
            password
        } = req.body;

        const imagefile = req.file; // For multer file upload

        // -----------------------------
        // 1️ Validate required fields
        // -----------------------------
        if (
            !name ||
            !email ||
            !specialization ||
            !degree ||
            !experience ||
            !about ||
            !availability ||
            !fee ||
            !address ||
            !password ||
            !imagefile
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                missing: {
                    name: !name,
                    email: !email,
                    specialization: !specialization,
                    degree: !degree,
                    experience: !experience,
                    about: !about,
                    availability: !availability,
                    fee: !fee,
                    address: !address,
                    password: !password,
                    image: !imagefile
                }
            });
        }

        // -----------------------------
        // 2️ Email validation
        // -----------------------------
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // -----------------------------
        // 3️ Password validation
        // -----------------------------
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // -----------------------------
        // 4️ Hash the password
        // -----------------------------
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // -----------------------------
        // 5️ Upload image to Cloudinary
        // -----------------------------
        const uploadedImg = await cloudinary.uploader.upload(imagefile.path, {
            resource_type: "image",
            folder: "doctors" // Organize images in a folder
        });

        const imageURL = uploadedImg.secure_url;

        // Validate that we got a proper URL
        if (!imageURL || !imageURL.startsWith('https://')) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload image to Cloudinary"
            });
        }

        console.log('Image uploaded successfully:', imageURL);

        // -----------------------------
        // 6️ Prepare final doctor object
        // -----------------------------
        
        // Parse address if it's a string
        let parsedAddress = address;
        if (typeof address === 'string') {
            try {
                parsedAddress = JSON.parse(address);
            } catch (e) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid address format. Must be valid JSON"
                });
            }
        }
        
        const doctorData = {
            name,
            email,
            specialization,
            degree,
            experience,
            about,
            availability,
            fee,
            password: hashedPassword,
            image: imageURL,
            address: parsedAddress,
            slots_booked: slots_booked ? JSON.parse(slots_booked) : {},
            date: Date.now()
        };
        
        console.log('Doctor data prepared:', { ...doctorData, password: '[HIDDEN]' });

        // -----------------------------
        // 7️ Save to database
        // -----------------------------
        const newDoctor = new doctormodel(doctorData);
        await newDoctor.save();

        // -----------------------------
        // 8️ Success response
        // -----------------------------
        console.log('Doctor saved successfully with ID:', newDoctor._id);
        console.log('Image URL saved:', newDoctor.image);
        
        return res.status(201).json({
            success: true,
            message: "Doctor added successfully",
            doctor: newDoctor
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error adding doctor",
            error: error.message
        });
    }
};
 // ApI FOR THE  admin login 

 const loginadmin = async (req, res) => {
   try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            message: "Admin logged in successfully",
            token
        });

    } else {
        res.json({
            success: false,
            message: "Invalid admin credentials"
        });
    }
} catch (error) {
    console.log(error);
    res.status(500).json({
        success: false,
        message: "Error logging in admin",
        error: error.message
    });
}

}


export { addDoctor,loginadmin };
