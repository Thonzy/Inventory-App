const User = require("../models/userModel");
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}




const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body

    // Validation
    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please fill in all required fields")
    }
    if (password.length < 8){
        res.status(400)
        throw new Error("Password must be 8 characters")
    }


    // Check user email if it exist
    const userExists = await User.findOne({email})

    if(userExists) {
        res.status(400)
        throw new Error("Email already in use.")
    }


    // Creating new User
    const user = await User.create({
        name,
        email,
        password,
    })


    //Generate token
    const token = generateToken(user._id)

    // send http-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
    })

    if(user){
        const {_id, name, email, photo, empNum, bio} = user
        res.status(201).json({
            _id, name, email, photo, empNum, bio, token
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
});

// Log in User
const loginUser = asyncHandler( async (req, res) => {
    res.send("Login User");
});

module.exports = {
    registerUser,
    loginUser,
};