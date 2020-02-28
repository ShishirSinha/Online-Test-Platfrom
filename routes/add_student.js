var express = require('express');
const moment = require('moment');
var pool = require('../config/database');

var app = express();

app.get('/',function(req,res){
    console.log("here on Add Student");
    res.render('add_student.ejs');
});

module.exports = app;