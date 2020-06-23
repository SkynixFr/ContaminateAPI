const express = require("express");
const router = express.Router();
const User = require("../model/User");
const verify = require("./verifyToken");
const { CustomException } = require("../utils/errorHandling");

//Get all users, returns users
router.get("/", verify, async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: "Liste des utilisateurs",
      code: 200,
      users: users,
    });
  } catch (error) {
    return next(
      CustomException("Internal Server Error", 500, req.url, req.method)
    );
  }
});

//Get a user, returns user
router.get("/:userId", verify, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json({
      message: "Informations de l'utilisateur",
      code: 200,
      user: user,
    });
  } catch (error) {
    return next(
      CustomException("L'utilisateur n'existe pas", 400, req.url, req.method)
    );
  }
});

//Update a user, returns saved user
router.patch("/:userId", verify, async (req, res, next) => {
  //Check if the data isn't empty
  if (Object.keys(req.body).length === 0)
    return next(
      CustomException("Données manquantes", 400, req.url, req.method)
    );

  try {
    const user = await User.findOne({
      _id: req.params.userId,
    });
    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;
    try {
      const savedUser = await user.save();
      res.status(201).json({
        message: "L'utilisateur a bien été modifié",
        code: 201,
        user: savedUser,
      });
    } catch (error) {
      return next(
        CustomException("Internal Server Error", 500, req.url, req.method)
      );
    }
  } catch (error) {
    return next(
      CustomException("L'utilisateur n'existe pas", 400, req.url, req.method)
    );
  }
});
module.exports = router;
