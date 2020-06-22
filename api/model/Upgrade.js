const mongoose = require("mongoose");
const UpgradeSchema = mongoose.Schema({
  game: {
    type: mongoose.Types.ObjectId,
    ref: "Game",
  },
  upgrade: {
    type: mongoose.Types.ObjectId,
    ref: "DefaultUpgrade",
  },
  price: {
    type: Number,
    require: true,
  },
  production: {
    type: Number,
    require: true,
  },
  level: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("Upgrade", UpgradeSchema);
