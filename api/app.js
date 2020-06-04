const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

//Import Routes
const userRoute = require('./routes/user');

//Middleware 
app.use('/users', userRoute);

//Connect to DB
try{
    mongoose.connect('mongodb://localhost:27018/contaminate', {useNewUrlParser: true, useUnifiedTopology: true}, () => {
        console.log("Connected to DB !");
    });
}catch(error){
    console.log(error);   
}

app.listen(3000);