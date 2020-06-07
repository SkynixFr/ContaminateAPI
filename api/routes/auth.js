const express = require("express");
const router = express.Router();
const User = require("../model/User");
const {registerValidation, loginValidation} = require("../utils/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//CREATE one user
router.post("/register", async (req, res) => {

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
        username: req.body.username
    })
    if(emailExist || usernameExist) return res.status(400).json({
        status: "error",
        message: "Account already exist"
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

//LOGIN one user
router.post("/login", async (req, res) => {
    //Checking in data isn't empty
    if(req.body.username == null || req.body.password == null) return res.status(400).json({
        status: "error",
        message: "Données manquantes"
    });

    //Checking if data is good
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if the username exist
    const user = await User.findOne({
        username: req.body.username
    })
    if(!user) return res.status(400).json({
        status: "error",
        message: "Mauvais pseudo ou mot de passe."
    })

    //Checking if the password is correct
    const validePassword = await bcrypt.compare(req.body.password, user.password);
    if(!validePassword) return res.status(400).json({
        status: "error",
        message: "Mauvais pseudo ou mot de passe."
    })

    //Create and assing a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header("auth-token", token).json({
        message: "Success !"
    });
   
    
})
module.exports = router; 