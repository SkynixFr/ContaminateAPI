const mongoose = require("mongoose");
const Float = require("mongoose-float").loadType(mongoose, 3);
const UpgradeSchema = mongoose.Schema(
  {
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
      type: Float,
      require: true,
    },
    level: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Upgrade", UpgradeSchema);
