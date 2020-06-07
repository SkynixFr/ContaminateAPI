const express = require("express");
const router = express.Router();
const User = require("../model/User");
const verify = require("./verifyToken");

//GET all users
router.get("/", verify, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        })
    }
});

//GET one user
router.get("/:userId", async (req, res) => {
    if(req.params.userId == null) return res.status(400).json({
        status: "error",
        message: "Données manquantes"
    });
    try{
        const user = await User.findById(req.params.userId);
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        })
    }
});

//Update one user
router.patch('/:userId', async (req, res) => {
    if(req.params.userId == null || req.body == null) return res.status(400).json({
        status: "error",
        message: "Données manquantes"
    });
    try {
        const updateUser = await User.updateOne({
            _id: req.params.userId
        },{
            $set : req.body
        });
        res.status(201).json(updateUser);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        })
    }
    
})
module.exports = router; 