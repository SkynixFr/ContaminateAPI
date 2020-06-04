const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Users");
});

router.get("/profil", (req, res) => {
    res.send("Users profil");
});

module.exports = router; 