import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    specialization:{type:String, required:true},
    image:{type:String, required:true},
    degree:{type:String, required:true},
    experience:{type:Number, required:true},
    about:{type:String, required:true},
    availability:{type:Boolean, required:true},
    fee:{type:Number, required:true},
    address:{type:Object, required:true},
    date:{type:Number, default:Date.now ,required:true},
    slots_booked:{type:Object, default:{}}
} ,{minimize:false});

const DoctorModel =mongoose.model.doctors || mongoose.model('doctors', doctorSchema); 
export default DoctorModel