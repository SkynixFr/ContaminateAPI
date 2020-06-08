const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const {dbhost, dbname} = require("./config/settings");
const port = process.env.PORT || 3000;
const mongodb = process.env.MONGODB_URI || "mongodb://" + dbhost.dev + "/" + dbname;

dotenv.config();

//Import Routes
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

//Middleware 
app.use(bodyParser.json());
app.use('/users', userRoute);
app.use('/auth', authRoute);

//Connect to DB
try{
    mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
        console.log("Connected to DB !");
    });
}catch(error){
    console.log(error);   
}

app.listen(port);