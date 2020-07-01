const mongoose = require("mongoose");
const GameSchema = mongoose.Schema(
  {
    golds: {
      type: Number,
      default: 0,
      require: true,
    },
    twitchPts: {
      type: Number,
      default: 0,
      require: true,
    },
    production: {
      type: Number,
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
