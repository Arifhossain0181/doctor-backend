import DoctorModel from "../Models/doctormodel.js";
import AppointmentModel from "../Models/aPPointmentModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// get all doctors list
export const doctorlist = async (req, res) => {
  try {
    const doctors = await DoctorModel.find({ available: true }).select("-password -email");
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// doctor login
export const doctorlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await DoctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      token,
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        image: doctor.image,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// change doctor availability
export const changeavilability = async (req, res) => {
  try {
    const { doctorId } = req.body;
    
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    await DoctorModel.findByIdAndUpdate(doctorId, { available: !doctor.available });
    
    res.json({ success: true, message: "Availability updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get doctor appointments
export const appointmentsdoctor = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find({
      doctorId: req.doctorId,
    }).sort({ date: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to mark appointment as completed by doctor Panel
export const markappointmentcompleted = async (req, res) => {
  try {
    const { doctorId,appointmentId } = req.body; 
    const appointment = await AppointmentModel.findById({  appointmentId });
    if(appointment && appointment.doctorId.toString() === doctorId ){
      await AppointmentModel.findByIdAndUpdate( appointmentId, { status: 'completed' });
    
    }
    else{
      return res.status(404).json({ success: false, message: "Appointment not found or unauthorized" });
    }
    res.json({ success: true, message: "Appointment marked as completed" });
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
