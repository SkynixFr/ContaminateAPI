const express = require("express");
const router = express.Router();
const Game = require("../model/Game");
const { CustomException } = require("../utils/errorHandling");
const verify = require("./verifyToken");
const jwt = require("jsonwebtoken");

//CREATE one game
router.post("/", verify, async (req, res, next) => {
  const token = req.header("auth-token");
  const payload = jwt.decode(token);
  if (!payload)
    return next(CustomException("Token invalide", 400, req.url, req.method));

  const idUserExist = await Game.findOne({
    user: payload._id,
  });
  if (idUserExist)
    return next(
      CustomException("La partie existe déjà", 400, req.url, req.method)
    );
  const game = new Game({
    gold: 0,
    twitchPts: 0,
    user: payload._id,
  });
  try {
    const savedGame = await game.save();
    res.status(201).json({
      message: "La partie a bien été créée",
      code: 201,
      game: savedGame,
    });
  } catch (error) {
    return next(
      CustomException("Internal Server Error", 500, req.url, req.method)
    );
  }
});

module.exports = router;
