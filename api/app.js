const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { dbhost, dbname } = require("./config/settings");
const port = process.env.PORT || 3000;
const mongodb =
  process.env.MONGODB_URI || "mongodb://" + dbhost.dev + "/" + dbname;
const { errorHandler } = require("./utils/errorHandling");
const cors = require("cors");

dotenv.config();

//Import Routes
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const gameRoute = require("./routes/game");
const upgradeRoute = require("./routes/upgrade");

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/games", gameRoute);
app.use("/upgrade", upgradeRoute);

//Connect to DB
try {
  mongoose.connect(
    mongodb,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to DB !");
    }
  );
} catch (error) {
  console.log(error);
}
app.use(errorHandler);
app.listen(port);
