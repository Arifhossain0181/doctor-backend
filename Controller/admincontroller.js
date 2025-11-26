// aPi for adding doctor 
import validator from 'validator';
import bcrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import doctormodel from '../Models/doctormodel.js';
const addDoctor = async (req, res) => {
    try{

        const {name, email, specialization, slots_booked, date,address,password,image,degree,experience,about,availability,fee } = req.body;

        const imagefile = req.file;

       if(!name || !email || !specialization || !imagefile || !degree || !experience || !about || !availability || !fee || !address || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                missing: {
                    name: !name,
                    email: !email,
                    specialization: !specialization,
                    image: !imagefile,
                    degree: !degree,
                    experience: !experience,
                    about: !about,
                    availability: !availability,
                    fee: !fee,
                    address: !address,
                    password: !password
                }
            })
       }

       if(!validator.isEmail(email)){

            return res.status(400).send({message: "Invalid email format"});
       }
       // Passed all validations
       if(password.length < 6){
            return res.status(400).send({message: "Password must be at least 6 characters long"});
       }
       // Hash the password
       const salt = await bcrypt.genSalt(10)
       ; const hasPassword = await bcrypt.hash(password, salt);

       // uPload image to cloudnaring

       const imgeUPlload = await cloudinary.uploader.upload(imagefile.path, {
        resource_type: 'image',
           
       });
       const imageURlLInk = imgeUPlload.secure_url;

       // create new doctor object
       const docorData ={
        name,
        email,
        image: imageURlLInk,
        password: hasPassword,
        specialization,
        degree,
        experience,
        about,
        availability,
        fee,
        address: JSON.parse(address),
        slots_booked: slots_booked ? JSON.parse(slots_booked) : {},
        date: Date.now(),
       }

       const newDoctor = new doctormodel(docorData);
       await newDoctor.save();
       res.status(201).json({success: true, message: "Doctor added successfully", doctor:newDoctor});

    }
    catch(error){
        console.log(error);
        res.status(500).json({success: false, message: "Error adding doctor", error: error.message});
    }
}

export {addDoctor};