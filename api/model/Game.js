const mongoose = require("mongoose");
const Float = require("mongoose-float").loadType(mongoose, 3);
const GameSchema = mongoose.Schema(
  {
    golds: {
      type: Float,
      default: 0,
      require: true,
    },
    twitchPts: {
      type: Number,
      default: 0,
      require: true,
    },
    production: {
      type: Float,
      default: 0,
      require: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", GameSchema);
