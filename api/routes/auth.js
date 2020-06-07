const express = require("express");
const router = express.Router();
const User = require("../model/User");
const {registerValidation, loginValidation} = require("../utils/validation");
const bcrypt = require("bcryptjs");

//CREATE on user
router.post("/signin", async (req, res) => {

    //Checking in data isn't empty
    if(req.body.email == null || req.body.username == null || req.body.password == null) return res.status(400).json({
        status: "error",
        message: "Missing data"
    });

    //Checking if data is good
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);


    //Checking if the user is already in the database
    const emailExist = await User.findOne({
        email: req.body.email
    })
    const usernameExist = await User.findOne({
        email: req.body.username
    })
    if(emailExist || usernameExist) return res.status(400).json({
        status: "error",
        message: "Email already exist"
    })

    //Hashing the password
    const salt= await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: hashPassword
    });
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        })
    }   
});

module.exports = router; 