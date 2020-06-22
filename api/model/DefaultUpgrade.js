const mongoose = require("mongoose");
const DefaultUpgrade = mongoose.Schema({
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
  },
});

module.exports = mongoose.model("DefaultUpgrade", DefaultUpgrade);
