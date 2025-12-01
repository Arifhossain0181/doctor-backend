// middleware/authadmin.js
import jwt from 'jsonwebtoken';

const authadmin = (req, res, next) => {
    try {
        const { atoken } = req.headers;
        if (!atoken) return res.status(401).json({ success: false, message: "Not authorized, login again" });

        const decoded = jwt.verify(atoken, process.env.JWT_SECRET);
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: "Not authorized, login again" });
        }

        console.log('Admin authenticated:', decoded.email);
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({ success: false, message: "Not authorized, login again" });
    }
};

export { authadmin };
export default authadmin;
