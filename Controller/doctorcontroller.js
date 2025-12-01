import DoctorModel from "../Models/doctormodel.js";

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

export { changeavilability, doctorlist };