const express = require("express");
const router = express.Router();
const Game = require("../model/Game");
const DefaultUpgrade = require("../model/DefaultUpgrade");
const Upgrade = require("../model/Upgrade");
const { CustomException } = require("../utils/errorHandling");
const verify = require("./verifyToken");
const jwt = require("jsonwebtoken");

//GET all default upgrade
router.get("/default", verify, async (req, res, next) => {
  try {
    const defaultUpgrade = await DefaultUpgrade.find();
    res.status(200).json({
      message: "Liste des améliorations par défaut",
      code: 200,
      upgrade: defaultUpgrade,
    });
  } catch (error) {
    return next(
      CustomException("Internal Server Error", 500, req.url, req.method)
    );
  }
});

//GET all modified upgrade of one game
router.get("/:gameId", verify, async (req, res, next) => {
  try {
    const upgradeModified = await Upgrade.find({
      game: req.params.gameId,
    });
    res.status(200).json({
      message: "Voici toutes les améliorations modifiées de la partie",
      code: 200,
      upgrades: upgradeModified,
    });
  } catch (error) {
    return next(
      CustomException("La partie n'existe pas", 400, req.url, req.method)
    );
  }
});

//CREATE one default upgrade
router.post("/default", verify, async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(
      CustomException("Données manquantes", 400, req.url, req.method)
    );
  const defaultUpgrade = new DefaultUpgrade({
    name: req.body.name,
    price: req.body.price,
    production: req.body.production,
    scaling: req.body.scaling,
    level: req.body.level,
  });
  try {
    const savedUpgrade = await defaultUpgrade.save();
    res.status(201).json({
      message: "L'amélioration par défaut a été bien créée",
      code: 201,
      upgrade: savedUpgrade,
    });
  } catch (error) {
    return next(
      CustomException("Internal Server Error", 500, req.url, req.method)
    );
  }
});

//CREATE the modified upgrade and check if the modified upgrade exist if yes then modify it
router.patch("/:gameId/:upgradeId", verify, async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(
      CustomException("Données manquantes", 400, req.url, req.method)
    );
  const upgradeModified = await Upgrade.findOne({
    upgrade: req.params.upgradeId,
  });
  if (upgradeModified) {
    if (req.body.level) upgradeModified.level = req.body.level;
    if (req.body.production) upgradeModified.production = req.body.production;
    if (req.body.price) upgradeModified.price = req.body.price;
    try {
      const upgradeModifiedSaved = await upgradeModified.save();
      res.status(201).json({
        message: "L'amélioration a bien été modifiée",
        code: 201,
        upgrade: upgradeModifiedSaved,
      });
    } catch (error) {
      return next(
        CustomException("Internal Server Error", 500, req.url, req.method)
      );
    }
  } else {
    try {
      await Game.findById(req.params.gameId);
      try {
        const saveUpgrade = new Upgrade({
          game: req.params.gameId,
          upgrade: req.params.upgradeId,
        });
        if (req.body.level) saveUpgrade.level = req.body.level;
        if (req.body.production) saveUpgrade.production = req.body.production;
        if (req.body.price) saveUpgrade.price = req.body.price;
        await saveUpgrade.save();
        res.status(201).json({
          message: "L'amélioration a bien été modifié",
          code: 201,
          upgrade: saveUpgrade,
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
  }
});
module.exports = router;
