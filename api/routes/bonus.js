const express = require("express");
const router = express.Router();
const Game = require("../model/Game");
const DefaultBonus = require("../model/DefaultBonus");
const Bonus = require("../model/Bonus");
const { CustomException } = require("../utils/errorHandling");
const verify = require("./verifyToken");

//Get all default bonus, returns default bonus
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

//Create a default bonus
router.post("/default", verify, async (req, res, next) => {
  //Check if the data isn't empty
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
    const savedDefaultBonus = await defaultBonus.save();
    res.status(201).json({
      message: "Le bonus par défaut a été bien créé",
      code: 201,
      upgrade: savedDefaultBonus,
    });
  } catch (error) {
    return next(
      CustomException("Internal Server Error", 500, req.url, req.method)
    );
  }
});

//Update a default bonus, returns default bonus
router.patch("/default/:defaultId", verify, async (req, res, next) => {
  //Check if the data isn't empty
  if (Object.keys(req.body).length === 0)
    return next(
      CustomException("Données manquantes", 400, req.url, req.method)
    );

  try {
    const modifiedDefaultBonus = await DefaultBonus.findById(
      req.params.defaultId
    );
    if (req.body.name) modifiedDefaultBonus.name = req.body.name;
    if (req.body.description)
      modifiedDefaultBonus.description = req.body.description;
    if (req.body.price) modifiedDefaultBonus.price = req.body.price;
    try {
      const savedModifiedDefaultBonus = await modifiedDefaultBonus.save();
      res.status(201).json({
        message: "Le bonus par défaut a bien été modifié",
        code: 201,
        upgrade: savedModifiedDefaultBonus,
      });
    } catch (error) {
      return next(
        CustomException("Internal Server Error", 400, req.url, req.method)
      );
    }
  } catch (error) {
    return next(
      CustomException(
        "Le bonus par défaut n'existe pas",
        400,
        req.url,
        req.method
      )
    );
  }
});

//Get all modified bonus from one game, returns bonus
router.get("/:gameId", verify, async (req, res, next) => {
  try {
    const modifiedBonus = await Bonus.find({
      game: req.params.gameId,
    });
    res.status(200).json({
      message: "Liste des bonus modifiés de la partie",
      code: 200,
      bonus: modifiedBonus,
    });
  } catch (error) {
    return next(
      CustomException("La partie n'existe pas", 400, req.url, req.method)
    );
  }
});

//Create a modified bonus and check if the modified bonus exists, if yes then modify it and returns it
router.patch("/:gameId/:bonusId", verify, async (req, res, next) => {
  try {
    await Game.findById(req.params.gameId);
    try {
      await DefaultBonus.findById(req.params.bonusId);
      try {
        const modifiedBonus = new Bonus({
          game: req.params.gameId,
          bonus: req.params.bonusId,
          isBought: true,
        });
        const savedModifiedBonus = await modifiedBonus.save();
        res.status(201).json({
          message: "Le bonus a bien été modifié",
          code: 201,
          upgrade: savedModifiedBonus,
        });
      } catch (error) {
        return next(
          CustomException("Internal Server Error", 500, req.url, req.method)
        );
      }
    } catch (error) {
      return next(
        CustomException("Le bonus n'existe pas", 400, req.url, req.method)
      );
    }
  } catch (error) {
    return next(
      CustomException("La partie n'existe pas", 400, req.url, req.method)
    );
  }
});
module.exports = router;
