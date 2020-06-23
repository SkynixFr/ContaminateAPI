const express = require("express");
const router = express.Router();
const Game = require("../model/Game");
const { CustomException } = require("../utils/errorHandling");
const verify = require("./verifyToken");
const jwt = require("jsonwebtoken");

//Create a game and check if the game exists, if yes returns it
router.post("/", verify, async (req, res, next) => {
  //Check if the token exists
  const token = req.header("auth-token");
  const payload = jwt.decode(token);
  if (!payload)
    return next(CustomException("Token invalide", 400, req.url, req.method));

  //Check if the game exists, if not creates it
  const UserExist = await Game.findOne({
    user: payload._id,
  });
  if (UserExist) {
    const savedGame = await Game.findOne(UserExist);
    res.status(200).json({
      message: "Informations de la partie",
      code: 200,
      game: savedGame,
    });
  } else {
    const game = new Game({
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
  }
});

//Get the user's game, returns the game
router.get("/user", verify, async (req, res, next) => {
  //Check if the token exists
  const token = req.header("auth-token");
  const payload = jwt.decode(token);
  if (!payload)
    return next(CustomException("Token invalide", 400, req.url, req.method));

  try {
    const game = await Game.findOne({
      user: payload._id,
    });
    res.status(200).json({
      message: "Informations de la partie",
      code: 200,
      game: game,
    });
  } catch (error) {
    return next(
      CustomException("Vous n'avez pas de partie", 400, req.url, req.method)
    );
  }
});

//Update a game, returns the game
router.patch("/:gameId", verify, async (req, res, next) => {
  //Check if the data isn't empty
  if (Object.keys(req.body).length === 0)
    return next(
      CustomException("Données manquantes", 400, req.url, req.method)
    );

  try {
    const game = await Game.findById({
      _id: req.params.gameId,
    });
    if (req.body.golds) game.golds = req.body.golds;
    if (req.body.twitchPts) game.twitchPts = req.body.twitchPts;
    try {
      game.save();
      res.status(201).json({
        message: "La partie a bien été sauvegardée",
        code: 201,
        game: game,
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
