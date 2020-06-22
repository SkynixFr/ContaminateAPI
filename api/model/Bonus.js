const mongoose = require("mongoose");
const BonusSchema = mongoose.Schema({
  game: {
    type: mongoose.Types.ObjectId,
    ref: "Game",
  },
  bonus: {
    type: mongoose.Types.ObjectId,
    ref: "DefaultBonus",
  },
  isBought: {
    type: Boolean,
    require: true,
  },
});

module.exports = mongoose.model("Bonus", BonusSchema);
