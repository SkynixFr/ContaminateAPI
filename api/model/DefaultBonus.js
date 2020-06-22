const mongoose = require("mongoose");
const DefaultBonus = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  isBought: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("DefaultBonus", DefDefaultBonusaultUpgrade);
