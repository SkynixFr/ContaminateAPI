const mongoose = require("mongoose");
const GameSchema = mongoose.Schema({
  golds: {
    type: Number,
    require: true,
  },
  twitchPts: {
    type: Number,
    require: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  amelioration: [{}],
});

module.exports = mongoose.model("Game", GameSchema);
