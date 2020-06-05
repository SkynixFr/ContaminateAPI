const express = require("express");
const router = express.Router();
const User = require("../model/User");

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        })
    }
});

router.get("/:userId", async (req, res) => {
    if(!req.params.userId){
        try{
            const user = await User.findById(req.params.userId);
            res.json(user);
        }catch(error){
            res.status(500).json({
                status: "error",
                message: "Internal Server Error"
            })
        }
        res.send(req.params.userId);
    }else{
        res.status(400).json({
            status: "error",
            message: "Mising data."
        })
    }
    
    
});

router.post("/signin", async (req, res) => {
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        mdp: req.body.mdp
    });
    if(user.username != null && user.email != null && user.mdp != null){
        try {
            const savedUser = await user.save();
            res.json(savedUser);
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Internal Server Error"
            })
        }
    }else{
        res.status(400).json({
            status: "error",
            message: "Mising data."
        })
    }
    
});

router.patch('/:userId', async (req, res) => {
    if(!req.params.userId && req.body){
        try {
            const updateUser = await User.updateOne({
                _id: req.params.userId
            },{
                $set : req.body
            });
            res.json(updateUser);
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Internal Server Error"
            })
        }
    }else{
        res.status(400).json({
            status: "error",
            message: "Mising data"
        })
    }
    
})
module.exports = router; 