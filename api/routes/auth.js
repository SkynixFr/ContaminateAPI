const express = require("express");
const router = express.Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../utils/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { CustomException } = require("../utils/errorHandling");

//Create a user in the database, returns a response
router.post("/register", async (req, res, next) => {
  //Check if the data isn't empty
  if (Object.keys(req.body).length === 0)
    return next(
      CustomException("Données manquantes", 400, req.url, req.method)
    );

  //Check if the data is correct
  const { error } = registerValidation(req.body);
  if (error)
    return next(CustomException("Données invalides", 400, req.url, req.method));

  //Check if the user exists
  const emailExists = await User.findOne({
    email: req.body.email,
  });
  const usernameExists = await User.findOne({
    username: req.body.username,
  });
  if (emailExists || usernameExists)
    return next(
      CustomException("Le compte existe déjà", 400, req.url, req.method)
    );

  const user = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });
  try {
    const savedUser = await user.save();
    res.status(201).json({
      message: "L'utilisateur a bien été créé",
      code: 201,
      user: savedUser,
    });
  } catch (error) {
    return next(
      CustomException("Internal Server Error", 500, req.url, req.method)
    );
  }
});

//User login, returns a token
router.post("/login", async (req, res, next) => {
  //Check if data isn't empty
  if (Object.keys(req.body).length === 0)
    return next(
      CustomException("Données manquantes", 400, req.url, req.method)
    );

  //Check if the data is correct
  const { error } = loginValidation(req.body);
  if (error)
    return next(CustomException("Données invalides", 400, req.url, req.method));

  //Check if the user exists
  const userExists = await User.findOne({
    username: req.body.username,
  });
  if (!userExists)
    return next(
      CustomException(
        "Mauvais pseudo ou mot de passe",
        400,
        req.url,
        req.method
      )
    );

  //Check if the password is correct
  const validePassword = await bcrypt.compare(
    req.body.password,
    userExists.password
  );

  if (!validePassword)
    return next(
      CustomException(
        "Mauvais pseudo ou mot de passe",
        400,
        req.url,
        req.method
      )
    );

  //Create and assign a token
  const token = jwt.sign({ _id: userExists._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).json({
    token: token,
    message: "Success !",
  });
});
module.exports = router;
