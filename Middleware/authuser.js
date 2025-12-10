// middleware/authuser.js
import jwt from 'jsonwebtoken';

const authuser = (req, res, next) => {
    try {
        const {token } = req.headers;
        if (!token) return res.status(401).json({ success: false, message: "Not authorized, login again" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
       
        console.log('User authenticated:', decoded.id);
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({ success: false, message: "Not authorized, login again" });
    }
};

export { authuser };
export default authuser;
