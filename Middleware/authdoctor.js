// middleware/authuser.js
import jwt from 'jsonwebtoken';
// doctor authentication middleware
const authdoctor = (req, res, next) => {
    try {
        const {dtoken } = req.headers;
        if (!dtoken) return res.status(401).json({ success: false, message: "Not authorized, login again" });

        const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
        req.doctorId = decoded.id;
       
        console.log('doctor authenticated:', decoded.id);
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({ success: false, message: "Not authorized, login again" });
    }
};

export { authdoctor };
export default authdoctor;