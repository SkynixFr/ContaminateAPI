const jwt = require("jsonwebtoken");
const { CustomException } = require("../utils/errorHandling");

//Check if the token exists
module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token)
    return next(
      CustomException("Accès non autorisé", 401, req.url, req.method)
    );
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return next(CustomException("Token invalide", 400, req.url, req.method));
  }
};
