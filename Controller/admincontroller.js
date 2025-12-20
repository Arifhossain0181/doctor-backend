// controllers/adminController.js
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctormodel from "../Models/doctormodel.js";
import jwt from "jsonwebtoken";

// -----------------------------
// Add Doctor API
// -----------------------------
const addDoctor = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const {
      name,
      email,
      speciality, // frontend sends "speciality"
      degree,
      experience,
      about,
      availability = "Available",
      fees,
      address,
      slots_booked,
      password,
    } = req.body;

    const imagefile = req.file; // multer file: field name "docimg"

    // Map frontend fields to DB
    const specialization = speciality;
    const fee = fees;

    // -----------------------------
    // Validate required fields
    // -----------------------------
    if (
      !name ||
      !email ||
      !specialization ||
      !degree ||
      !experience ||
      !about ||
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
          image: !imagefile,
        },
      });
    }

    // -----------------------------
    // Email validation
    // -----------------------------
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // -----------------------------
    // Password validation
    // -----------------------------
    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
    }

    // -----------------------------
    // Hash the password
    // -----------------------------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // -----------------------------
    // Upload image to Cloudinary
    // -----------------------------
    const uploadedImg = await cloudinary.uploader.upload(imagefile.path, {
      resource_type: "image",
      folder: "doctors",
    });

    const imageURL = uploadedImg.secure_url;
    if (!imageURL || !imageURL.startsWith("https://")) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to upload image to Cloudinary",
        });
    }

    // -----------------------------
    // Parse address JSON
    // -----------------------------
    let parsedAddress = address;
    if (typeof address === "string") {
      try {
        parsedAddress = JSON.parse(address);
      } catch (e) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Invalid address format. Must be valid JSON",
          });
      }
    }

    // -----------------------------
    // Prepare doctor object
    // -----------------------------
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
      date: Date.now(),
    };

    // -----------------------------
    // Save to database
    // -----------------------------
    const newDoctor = new doctormodel(doctorData);
    await newDoctor.save();

    return res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: newDoctor,
    });
  } catch (error) {
    console.error("Add Doctor Error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error adding doctor",
        error: error.message,
      });
  }
};

// -----------------------------
// Admin Login API
// -----------------------------
const loginadmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res.json({
        success: true,
        message: "Admin logged in successfully",
        token,
      });
    } else {
      return res.json({ success: false, message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error logging in admin",
        error: error.message,
      });
  }
};

// -----------------------------
//API to get all doctors list

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctormodel
      .find({})
      .select("-password")
      .sort({ date: -1 });
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Get All Doctors Error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error fetching doctors",
        error: error.message,
      });
  }
};
/// aPi to get all aPPointments list 
const allAppointmentsadmin = async (req, res) => {
    try{
        const appointments = await  appointmentsmodel.find()
        res.json({ success: true, appointments });
    }
    catch (error) {
        console.error("Get All Appointments Error:", error);
        return res
          .status(500)
          .json({
            success: false,
            message: "Error fetching appointments",
            error: error.message,
          });
      }
}

export { addDoctor, loginadmin, allDoctors, allAppointmentsadmin };