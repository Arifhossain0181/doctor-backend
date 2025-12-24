// controllers/adminController.js
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import DoctorModel from "../Models/doctormodel.js";
import jwt from "jsonwebtoken";
import AppointmentModel from "../Models/aPPointmentModel.js";
import UserModel from "../Models/usermodel.js";

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
      return res.status(400).json({
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
      return res.status(500).json({
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
        return res.status(400).json({
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
    const newDoctor = new DoctorModel(doctorData);
    await newDoctor.save();

    return res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: newDoctor,
    });
  } catch (error) {
    console.error("Add Doctor Error:", error);
    return res.status(500).json({
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

    // Debug logging
    console.log("Login attempt:", {
      receivedEmail: email,
      receivedPassword: password,
      expectedEmail: process.env.ADMIN_EMAIL,
      expectedPassword: process.env.ADMIN_PASSWORD,
    });

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
    return res.status(500).json({
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
    const doctors = await DoctorModel.find({})
      .select("-password")
      .sort({ date: -1 });
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Get All Doctors Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};
/// aPi to get all aPPointments list
const allAppointmentsadmin = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find();
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Get All Appointments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};
const cancelAPPointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    console.log("Cancel appointment request:", appointmentId);

   

    const appointmentData = await AppointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Check if already cancelled
    if (appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment already cancelled",
      });
    }

    console.log("Appointment data:", appointmentData);

    // Get doctorId from appointment
    const doctorId =
      appointmentData.doctorId ||
      appointmentData.doctor ||
      appointmentData.docData?._id;

    if (!doctorId) {
      return res.json({
        success: false,
        message: "Doctor ID not found in appointment",
      });
    }

    const { slotDate, slotTime } = appointmentData;

    console.log("Doctor ID:", doctorId, "Slot:", slotDate, slotTime);

    // Mark cancelled
    await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { $set: { cancelled: true } },
      { new: true }
    );

    // Free doctor slot
    const doctor = await DoctorModel.findById(doctorId);

    console.log("Doctor found:", doctor ? doctor.name : "NULL");

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    let slots_booked = doctor.slots_booked || {};

    if (Array.isArray(slots_booked[slotDate])) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );
    }

    await DoctorModel.findByIdAndUpdate(doctorId, { slots_booked });

    console.log("Appointment cancelled successfully");

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    res.json({
      success: false,
      message: "Failed to cancel appointment",
      error: error.message,
    });
  }
};

// -----------------------------
// API to get data for admin Panel

// -----------------------------

const admindashboard = async (req, res) => {
  try {
    const doctors = await DoctorModel.find({});
    const users = await UserModel.find({});
    const appointments = await AppointmentModel.find({});
    
    const dashboardData = {
      doctors: doctors.length,
      users: users.length,
      appointments: appointments.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    
    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
};

export {
  addDoctor,
  loginadmin,
  allDoctors,
  allAppointmentsadmin,
  cancelAPPointment,
  admindashboard
};
