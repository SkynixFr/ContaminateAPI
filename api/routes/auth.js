const express = require("express");
const router = express.Router();
const User = require("../model/User");
const validation = require("@hapi/joi");

// router.post("/signin", async (req, res) => {
//     const user = new User({
//         email: req.body.email,
//         username: req.body.username,
//         mdp: req.body.mdp
//     });
//     if(user.username != null && user.email != null && user.mdp != null){
//         try {
//             const savedUser = await user.save();
//             res.status(201).json(savedUser);
//         } catch (error) {
//             res.status(500).json({
//                 status: "error",
//                 message: "Internal Server Error"
//             })
//         }
//     }else{
//         res.status(400).json({
//             status: "error",
//             message: "Mising data."
//         })
//     }
    
// });

module.exports = router; 