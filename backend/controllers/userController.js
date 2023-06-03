const User = require("../models/userModel");
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

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
        const {_id, name, email, photo, empNum, bio, phone} = user
        res.status(201).json({
            _id, name, email, photo, empNum, bio, phone, token
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
});

// Log in User
const loginUser = asyncHandler( async (req, res) => {
    
    const {email, password} = req.body

    // Validate Request
    if(!email || !password){
        res.status(400)
        throw new Error("Please add an email and password")
    }

    // Check if user exist
    const user = await User.findOne({email})

    if (!user) {
        res.status(400)
        throw new Error("User not found, Please sign up")
    }

    // User exist, check password if correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password);

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

    if(user && passwordIsCorrect){
        const {_id, name, email, photo, empNum, bio, phone} = user
        res.status(200).json({
            _id, name, email, photo, empNum, bio, phone, token
        })
    } else {
        res.status(400);
        throw new Error("Invalid email or password");
    }

});

// Log out user
const logoutUser = asyncHandler (async (res, req) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // expire it
        sameSite: "none",
        secure: true,
    });
    return res.status(200).json({ message: "Succesfully Logged Out" });
});

// Get user data
const getUser = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user){
        const {_id, name, email, photo, empNum, bio, phone} = user
        res.status(200).json({
            _id, name, email, photo, empNum, bio, phone,
        })
    } else {
        res.status(400)
        throw new Error("User not Found")
    }
});

// Get login status
const loginStatus = asyncHandler( async (req, res) => {

    const token = req.cookies.token;
    if (!token) {
        return res.json(false);
    }

    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if(verified){
        return res.json(true)
    } else {
        return res.json(false)
    }

});

// Update user info
const updateUser = asyncHandler (async (req, res) => {

    const user = await User.findById(req.user._id);

    if (user) {
        const {_id, name, email, photo, phone, empNum, bio} = user;
        user.email = email;
        user.empNum = empNum;
        user.name = req.body.name || name;
        user.photo = req.body.photo || photo;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;

        const updatedUser = await user.save()
        res.status(200).json({
            _id: updateUser._id, 
            name: updateUser.name, 
            email: updateUser.email, 
            photo: updateUser.photo, 
            phone: updateUser.phone, 
            empNum: updateUser.empNum, 
            bio: updateUser.bio,
        })
    } else {
        res.status(404)
        throw new Error("User not Found")
    }

});

// Change password
const changePassword = asyncHandler ( async (req, res) => {

    const user = await User.findById(req.user._id)

    const {oldPassword, password} = req.body

    if(!user) {
        res.status(400)
        throw new Error("User not found, please sign up")
    }
    //validate password
    if(!oldPassword || !password) {
        res.status(400)
        throw new Error("Please add old and new password")
    }

    // check if old password match within the database
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)

    // Saving new password
    if(user && passwordIsCorrect) {
        user.password = password
        await user.save()
        res.status(200).send("Password Changed Successfully")
    } else {
        res.status(400)
        throw new Error("Old Password is incorrect")
    }
})

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
};