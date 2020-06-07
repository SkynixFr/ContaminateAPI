const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("auth-token");
    if(!token) return res.status(401).json({
        status: "error",
        message: "Accès non autorisé"
    });

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        console.log(verified);
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "error",
            message: "Token invalide"
        })
    }
}