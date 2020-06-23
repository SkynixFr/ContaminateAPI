const mongoose = require("mongoose");
const DefaultUpgradeSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  production: {
    type: Number,
    require: true,
  },
  scaling: {
    type: Number,
    require: true,
  },
  level: {
    type: Number,
    require: true,
    default: 0,
  },
});

module.exports = mongoose.model("DefaultUpgrade", DefaultUpgradeSchema);
