import validator from "validator";
import bcrypt from "bcrypt";
import UserModel from "../Models/usermodel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import doctormodel from "../Models/doctormodel.js";
import AppointmentModel from "../Models/aPPointmentModel.js";

// ---------- Register User ----------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(201)
      .json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.error("User Registration Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

// ---------- Login User ----------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({
          success: false,
          message: "User not found. Please register first.",
        });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ success: true, message: "User logged in successfully", token });
  } catch (error) {
    console.error("User Login Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

// ---------- Get User Profile ----------
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userdata = await UserModel.findById(userId).select("-password -__v");
    if (!userdata)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: userdata });
  } catch (error) {
    console.error("Get User Profile Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

// ---------- Update User Profile ----------
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, address, dob, gender, phone } = req.body;
    const imagefile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "All data missing" });
    }

    const updateData = { name, address, dob, gender, phone };

    if (imagefile) {
      const imageBuffer = fs.readFileSync(imagefile.path);
      const base64Image = `data:${
        imagefile.mimetype
      };base64,${imageBuffer.toString("base64")}`;
      const uploadedImg = await cloudinary.uploader.upload(base64Image, {
        folder: "users",
      });
      updateData.image = uploadedImg.secure_url;
      fs.unlinkSync(imagefile.path); // remove temp file
    }

    await UserModel.findByIdAndUpdate(userId, updateData);
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update User Profile Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};
// ---------- Book Appointment ----------

export const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { doctorId, slotTime, slotDate } = req.body;

    const doctor = await doctormodel.findById(doctorId);
    if (!doctor)
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });

    const alreadyBooked = await AppointmentModel.findOne({
      userId,
      doctorId,
      slotTime,
      slotDate,
    });
    if (alreadyBooked) {
      return res
        .status(400)
        .json({ success: false, message: "Slot already booked" });
    }

    // Initialize slots_booked
    if (!doctor.slots_booked) doctor.slots_booked = {};
    if (!doctor.slots_booked[slotDate]) doctor.slots_booked[slotDate] = [];

    // Check if slot is already booked
    if (doctor.slots_booked[slotDate].includes(slotTime)) {
      return res
        .status(400)
        .json({ success: false, message: "Slot not available" });
    }

    // Book slot
    doctor.slots_booked[slotDate].push(slotTime);
    await doctor.save();

    const user = await UserModel.findById(userId).select("-password");

    const appointment = new AppointmentModel({
      userId,
      doctorId,
      slotDate,
      slotTime,
      userData: user,
      docData: doctor,
      amount: doctor.fee || doctor.fees || 0,
    });

    await appointment.save();

    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Book Appointment Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};
// -----------------------------API to get user appointments for frontend my appointments page
export const listAppointments = async (req, res) => {
    try{
        const userId = req.userId;
        const appointments = await AppointmentModel.find({userId})
        res.json({ success: true, appointments } );
    }
    catch(error){
         console.error("Fetch Appointments Error:", error);
         res.json({ success: false, message: "Failed to fetch appointments", error: error.message });
    }
}

