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

  //Check if the game already exist
  if (idUserExist) {
    const gameSave = await Game.findOne(idUserExist);
    res.status(200).json({
      message: "Voici la partie",
      code: 200,
      game: gameSave,
    });
  }

  const game = new Game({
    golds: 0,
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

//UPDATE one game
router.patch("/:gameId", verify, async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(
      CustomException("Données manquantes", 400, req.url, req.method)
    );
  try {
    const game = await Game.findOne({
      _id: req.params.gameId,
    });
    if (req.body.golds) game.golds = req.body.golds;
    if (req.body.twitchPts) game.twitchPts = req.body.twitchPts;
    try {
      game.save();
      res.status(201).json({
        message: "La partie a bien été sauvegardée",
        code: 201,
      });
    } catch (error) {
      return next(
        CustomException("Internal Server Error", 500, req.url, req.method)
      );
    }
  } catch (error) {
    return next(
      CustomException("La partie n'existe pas", 400, req.url, req.method)
    );
  }
});
module.exports = router;
