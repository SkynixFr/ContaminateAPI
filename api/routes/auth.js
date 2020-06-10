const express = require("express");
const router = express.Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../utils/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { CustomException } = require("../utils/errorHandling");

//CREATE one user
router.post("/register", async (req, res, next) => {
  //Checking in data isn't empty
  if (
    req.body.email == null ||
    req.body.username == null ||
    req.body.password == null
  )
    return next(
      CustomException("Données manquantes", 400, req.url, req.method)
    );

  //Checking if data is good
  const { error } = registerValidation(req.body);
  if (error)
    return next(
      CustomException(error.details[0].message, 400, req.url, req.method)
    );

  //Checking if the user is already in the database
  const emailExist = await User.findOne({
    email: req.body.email,
  });
  const usernameExist = await User.findOne({
    username: req.body.username,
  });
  if (emailExist || usernameExist)
    return next(
      CustomException("Le compte existe déjà", 400, req.url, req.method)
    );

  //Hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    email: req.body.email,
    username: req.body.username,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save();
    res.status(201).json({
      message: "L'utilisateur à bien été créé",
      code: 201,
      user: savedUser,
    });
  } catch (error) {
    return next(
      CustomException("Internal Server Error", 500, req.url, req.method)
    );
  }
});

//LOGIN one user
router.post("/login", async (req, res, next) => {
  //Checking in data isn't empty
  if (req.body.username == null || req.body.password == null)
    return next(CustomException("Données manquante", 400, req.url, req.method));

  //Checking if data is good
  const { error } = loginValidation(req.body);
  if (error)
    return next(
      CustomException(error.details[0].message, 400, req.url, req.method)
    );

  //Checking if the username exist
  const user = await User.findOne({
    username: req.body.username,
  });
  if (!user)
    return next(
      CustomException(
        "Mauvais pseudo ou mot de passe",
        400,
        req.url,
        req.method
      )
    );

  //Checking if the password is correct
  const validePassword = await bcrypt.compare(req.body.password, user.password);
  if (!validePassword)
    return next(
      CustomException(
        "Mauvais pseudo ou mot de passe",
        400,
        req.url,
        req.method
      )
    );

  //Create and assing a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).json({
    token: token,
    message: "Success !",
  });
});
module.exports = router;
