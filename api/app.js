const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const {dbhost, dbname} = require("./config/settings");

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
    mongoose.connect("mongodb://" + dbhost.dev + "/" + dbname, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
        console.log("Connected to DB !");
    });
}catch(error){
    console.log(error);   
}

app.listen(3000);