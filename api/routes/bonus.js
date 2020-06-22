const express = require("express");
const router = express.Router();
const Game = require("../model/Game");
const DefaultBonus = require("../model/DefaultBonus");
const Bonus = require("../model/Bonus");
const { CustomException } = require("../utils/errorHandling");
const verify = require("./verifyToken");
const jwt = require("jsonwebtoken");

//GET all default bonus
router.get("/default", verify, async (req, res, next) => {
  try {
    const defaultBonus = await DefaultBonus.find();
    res.status(200).json({
      message: "Liste des bonus par défaut",
      code: 200,
      bonus: defaultBonus,
    });
  } catch (error) {
    return next(
      CustomException("Internal Server Error", 500, req.url, req.method)
    );
  }
});

//GET all modified bonus of one game
router.get("/:gameId", verify, async (req, res, next) => {
  try {
    const bonusModified = await Bonus.find({
      game: req.params.gameId,
    });
    res.status(200).json({
      message: "Voici tous les bonus modifiés de la partie",
      code: 200,
      bonus: bonusModified,
    });
  } catch (error) {
    return next(
      CustomException("La partie n'existe pas", 400, req.url, req.method)
    );
  }
});

//CREATE one default bonus
router.post("/default", verify, async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(
      CustomException("Données manquantes", 400, req.url, req.method)
    );
  const defaultBonus = new DefaultBonus({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  });
  try {
    const savedBonus = await defaultBonus.save();
    res.status(201).json({
      message: "Le bonus par défaut a été bien créé",
      code: 201,
      upgrade: savedBonus,
    });
  } catch (error) {
    return next(
      CustomException("Internal Server Error", 500, req.url, req.method)
    );
  }
});

//CREATE the modified upgrade and check if the modified upgrade exist if yes then modify it
router.patch("/:gameId/:bonusId", verify, async (req, res, next) => {
  try {
    await Game.findById(req.params.gameId);
    try {
      const saveBonus = new Bonus({
        game: req.params.gameId,
        bonus: req.params.bonusId,
        isBought: true,
      });
      await saveBonus.save();
      res.status(201).json({
        message: "Le bonus a bien été modifié",
        code: 201,
        upgrade: saveBonus,
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
