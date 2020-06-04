const express = require('express');
const mongoose = require('mongoose');
const app = express();

//Import Routes
const userRoute = require('./routes/user');

//Middleware 
app.use('/users', userRoute);

//Connect to DB
mongoose.connect('mongodb://localhost:27018/contaminate', {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("Connected to DB !");
});



app.listen(3000);