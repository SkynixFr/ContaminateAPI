const mongoose = require("mongoose");
const Float = require("mongoose-float").loadType(mongoose, 3);
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
    type: Float,
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
  img: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("DefaultUpgrade", DefaultUpgradeSchema);
