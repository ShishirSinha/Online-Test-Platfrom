var express = require('express');
var pool = require('../config/database');

var app = express();

app.get('/',function(req,res){
    console.log("here on Dashboard");
    res.render('dashboard.ejs');
});

module.exports = app;