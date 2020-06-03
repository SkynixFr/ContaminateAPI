const http = require('http');
const express = require('express');
const app = express();
const hostname = 'localhost';
const port = 3000;
const connexionController = require('./controllers/connexionController');

app.get('/helloworld', (req, res) => res.json({msg:"hello world"}));

app.post('/signin', connexionController.signin);
app.post('/login', connexionController.login);

app.listen(port);