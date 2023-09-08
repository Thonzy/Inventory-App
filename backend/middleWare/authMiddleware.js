const User = require("../models/userModel");
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

const protect = asyncHandler (async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token){
            return res.status(401).json({ message: "Not authorized access, Please login." });
        }

        // Verify Token
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Get user id from token
        const user = await User.findById(verified.id).select("-password"); //user password will not show
        
        if(!user){
            return res.status(401).json({ message: "User not found." });
        }

        // Add user info to request object
        req.user = user;
        next();


    } catch (error) {
        return res.status(401).json({ message: "User not authorized." });
    }
});

module.exports = protect;