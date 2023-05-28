const User = require("../models/userModel");
const asyncHandler = require("express-async-handler")



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
        password
    })

    if(user){
        const {_id, name, email, photo, empNum, bio} = user
        res.status(201).json({
            _id, name, email, photo, empNum, bio
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
});

module.exports = {
    registerUser,
};