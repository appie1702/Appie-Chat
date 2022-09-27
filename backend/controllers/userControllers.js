// we use wrapper asynsHandler to throw an error if email,password,or name is not defined or empty
//ofcourse it must be async function to follow the error finding process
// step by step, eg: 1.) if something is empty. 2.) if something is incorrect or wrong.
// 3.) password matching and all, etc

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const { use } = require("../routes/userRoutes");
const { response } = require("express");

const registerUser = asyncHandler (async (req,res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("No Field should be empty")
    }

    //thats how you check if entered data is valid
    const userExists = await User.findOne({email});
    if (userExists) {
        res.status(400)
        throw new Error("User already exists");
    }
    // if user doesn't already exists
    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Failed to create the user");
    }
});


const authUser = asyncHandler(async (req,res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});


//everything starting with $ is mongoDB operators, you can read about it in doc
const allUsers = asyncHandler(async (req,res) => {
    const keyword = req.query.search ? {
        //or operator for mongoDB requests
        //if any of the mentioned conditions matches, it will
        //return truem otherwise false
        //i is for case sensitive
        $or: [
            { name: { $regex: req.query.search, $options: "i"}},
            { email: { $regex: req.query.search, $options: "i"}},
        ],
    }
    : {};

    const users = await User.find(keyword).find({_id: {$ne: req.user._id}});
    res.send(users);
});

//in brackets as the conpo is not by default exported
module.exports = {registerUser, authUser, allUsers};