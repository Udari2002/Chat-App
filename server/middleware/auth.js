import User from "../models/user.js";
import jwt from "jsonwebtoken";

//middleware to protect routes
export const protectRoute = async (req, res, next) => {
    try { 
        const token = req.headers.token;
        console.log('Auth middleware - token received:', token ? 'YES' : 'NO');

        if (!token) {
            return res.json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth middleware - decoded userId:', decoded.userId);

        const user = await User.findById(decoded.userId).select('-password');
        console.log('Auth middleware - user found:', user ? user.fullName : 'NOT FOUND');

        if (!user) return res.json({ success: false, message: "User not found" });
        req.user = user;
        next();
    } catch (error) {
        console.log('Auth middleware error:', error.message);
        res.json({ success: false, message: error.message });
    }
}