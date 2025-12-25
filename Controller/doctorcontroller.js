import DoctorModel from "../Models/doctormodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppointmentModel from "../Models/aPPointmentModel.js";
const changeavilability = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    const docdata = await DoctorModel.findById(docId);
    
    if (!docdata) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    await DoctorModel.findByIdAndUpdate(docId, {
      available: !docdata.available,
    });

    res.status(200).json({ 
      success: true, 
      message: "Availability changed successfully",
      available: !docdata.available 
    });
  } catch (error) {
    console.error("Change Availability Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to change availability",
      error: error.message 
    });
  }
};

const doctorlist = async (req, res) => {
    try{
        const doctors = await DoctorModel.find({}).select(['-password', '-email']);
        
        res.status(200).json({ success: true, doctors });
        
    }
    catch(error){
       console.error("Fetch Doctors Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch doctors", error: error.message });
    }
}
// doctor to login 
const doctorlogin = async (req, res) => {
  try{
    const { email, password } = req.body;
    const doctor = await DoctorModel.findOne({ email });
    if(!doctor){
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);

    if(isMatch){
      const token = jwt.sign({id: doctor._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
      
      // Return doctor data without password
      const doctorData = {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        degree: doctor.degree,
        experience: doctor.experience,
        about: doctor.about,
        fees: doctor.fees,
        address: doctor.address,
        available: doctor.available,
        image: doctor.image
      };
      
      res.json({ success: true, message: "Login successful", token, doctor: doctorData });
      return;
    }
    else{
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    
  }
  catch(error){
    console.error("Doctor Login Error:", error);
   res.status(500).json({ success: false, message: "Login failed", error: error.message });
   toast.error("Login failed"); 
  }
}

//aPi to get doctor aointmensts for doctor Panel
const appointmentsdoctor = async (req, res) => {
  try{
    const doctorId = req.doctorId;
    const appointments = await AppointmentModel.find({doctorId :req.doctorId.tostring()});
    res.status(200).json({ success: true, appointments });
  }
  catch(error){
    console.error("Fetch Appointments Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch appointments", error: error.message });
  }
}

export { changeavilability, doctorlist, doctorlogin, appointmentsdoctor };