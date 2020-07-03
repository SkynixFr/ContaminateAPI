const express = require("express");
const router = express.Router();
const Game = require("../model/Game");
const DefaultUpgrade = require("../model/DefaultUpgrade");
const Upgrade = require("../model/Upgrade");
const { CustomException } = require("../utils/errorHandling");
const verify = require("./verifyToken");

//Get all default upgrade, returns default upgrades
router.get("/default", verify, async (req, res, next) => {
  try {
    const defaultUpgrade = await DefaultUpgrade.find();
    res.status(200).json({
      defaultUpgrade,
      // message: "Liste des améliorations par défaut",
      // code: 200,
      // upgrades: defaultUpgrade,
    });
  } catch (error) {
    return next(
      CustomException("Internal Server Error", 500, req.url, req.method)
    );
  }
});

//Create a default upgrade, return default upgrade
router.post("/default", verify, async (req, res, next) => {
  //Check if the data isn't empty
  if (Object.keys(req.body).length === 0)
    return next(
      CustomException("Données manquantes", 400, req.url, req.method)
    );

  const defaultUpgrade = new DefaultUpgrade({
    name: req.body.name,
    price: req.body.price,
    production: req.body.production,
    scaling: req.body.scaling,
  });
  try {
    const savedDefaultUpgrade = await defaultUpgrade.save();
    res.status(201).json({
      message: "L'amélioration par défaut a bien été créée",
      code: 201,
      upgrade: savedDefaultUpgrade,
    });
  } catch (error) {
    return next(
      CustomException("Internal Server Error", 500, req.url, req.method)
    );
  }
});

//Update a default upgrade, returns default upgrade
router.patch("/default/:defaultId", verify, async (req, res, next) => {
  //Check if the data isn't empty
  if (Object.keys(req.body).length === 0)
    return next(
      CustomException("Données manquantes", 400, req.url, req.method)
    );

  try {
    const modifiedDefaultUpgrade = await DefaultUpgrade.findById(
      req.params.defaultId
    );
    if (req.body.name) modifiedDefaultUpgrade.name = req.body.name;
    if (req.body.price) modifiedDefaultUpgrade.price = req.body.price;
    if (req.body.production)
      modifiedDefaultUpgrade.production = req.body.production;
    if (req.body.scaling) modifiedDefaultUpgrade.scaling = req.body.scaling;
    try {
      const savedModifiedDefaultUpgrade = await modifiedDefaultUpgrade.save();
      res.status(201).json({
        message: "L'amélioration par défaut a bien été modifiée",
        code: 201,
        upgrade: savedModifiedDefaultUpgrade,
      });
    } catch (error) {
      return next(
        CustomException("Internal Server Error", 400, req.url, req.method)
      );
    }
  } catch (error) {
    return next(
      CustomException(
        "L'amélioration par défaut n'existe pas",
        400,
        req.url,
        req.method
      )
    );
  }
});

//Get all modified upgrades from one game, returns upgrades modified
router.get("/:gameId", verify, async (req, res, next) => {
  try {
    const modifiedUpgrade = await Upgrade.find({
      game: req.params.gameId,
    });
    res.status(200).json({
      modifiedUpgrade,
      // message: "Liste des améliorations modifiées de la partie",
      // code: 200,
      // upgrades: modifiedUpgrade,
    });
  } catch (error) {
    return next(
      CustomException("La partie n'existe pas", 400, req.url, req.method)
    );
  }
});

//Create a modified upgrade and check if the modified upgrade exists, if yes then modify it and returns it
router.patch("/:gameId/:upgradeId", verify, async (req, res, next) => {
  //Check if the data isn't empty
  if (Object.keys(req.body).length === 0)
    return next(
      CustomException("Données manquantes", 400, req.url, req.method)
    );

  //Check if the modified upgrade exists, if yes modify it
  const modifiedUpgrade = await Upgrade.findOne({
    upgrade: req.params.upgradeId,
  });
  if (modifiedUpgrade) {
    if (req.body.level) modifiedUpgrade.level = req.body.level;
    if (req.body.production) modifiedUpgrade.production = req.body.production;
    if (req.body.price) modifiedUpgrade.price = req.body.price;
    try {
      const savedModifiedUpgrade = await modifiedUpgrade.save();
      res.status(201).json({
        message: "L'amélioration a bien été modifiée",
        code: 201,
        upgrade: savedModifiedUpgrade,
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
        const modifiedUpgrade = new Upgrade({
          game: req.params.gameId,
          upgrade: req.params.upgradeId,
        });
        if (req.body.level) modifiedUpgrade.level = req.body.level;
        if (req.body.production)
          modifiedUpgrade.production = req.body.production;
        if (req.body.price) modifiedUpgrade.price = req.body.price;
        const savedModifiedUpgrade = await modifiedUpgrade.save();
        res.status(201).json({
          message: "L'amélioration a bien été modifiée",
          code: 201,
          upgrade: savedModifiedUpgrade,
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
