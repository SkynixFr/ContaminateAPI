const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require("body-parser");
const {dbhost, dbname} = require("./config/settings");

app.use(bodyParser.json());

console.log(process.env.ENV);

//Import Routes
const userRoute = require('./routes/user');

//Middleware 
app.use('/users', userRoute);

//Connect to DB
try{
    mongoose.connect("mongodb://" + dbhost.dev + "/" + dbname, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
        console.log("Connected to DB !");
    });
}catch(error){
    console.log(error);   
}

app.listen(3000);