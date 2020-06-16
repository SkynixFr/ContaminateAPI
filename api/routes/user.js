const express = require("express");
const router = express.Router();
const User = require("../model/User");
const verify = require("./verifyToken");
const { CustomException } = require("../utils/errorHandling");

//GET all users
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

//GET one user
router.get("/:userId", verify, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json({
      message: "Voici l'utilisateur",
      code: 200,
      user: user,
    });
  } catch (error) {
    return next(
      CustomException("Internal Server Error", 500, req.url, req.method)
    );
  }
});

//Update one user
router.patch("/:userId", verify, async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(
      CustomException("Données manquantes", 400, req.url, req.method)
    );
  try {
    const updateUser = await User.updateOne(
      {
        _id: req.params.userId,
      },
      {
        $set: req.body,
      }
    );
    res.status(201).json({
      message: "L'utilisateur a bien été modifié",
      code: 201,
      user: updateUser,
    });
  } catch (error) {
    return next(
      CustomException("Internal Server Error", 500, req.url, req.method)
    );
  }
});
module.exports = router;
