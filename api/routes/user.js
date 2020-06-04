const express = require("express");
const router = express.Router();
const User = require("../model/User");

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({
            message: error
        })
    }
});

router.get("/:userId", async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);
        res.status(200).json(user);
    }catch(error){
        res.status(404).json({
            message: error
        })
    }
    res.send(req.params.userId);
});

router.post("/signin", async (req, res) => {
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        mdp: req.body.mdp
    });
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({
            message: error
        })
    }
});

router.delete("/:userId", async (req, res) => {
    try {
        const removedUser = User.remove({_id: req.params.userId});
    } catch (error) {
        res.status(404).json({
            message: error
        })
    }
    
})
module.exports = router; 