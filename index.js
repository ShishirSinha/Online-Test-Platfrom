const express = require('express');
const bodyParser = require('body-parser');

const dashboard = require('./routes/dashboard');
const manage_client = require('./routes/manage_client');
const manage_exams = require('./routes/manage_exams');
const manage_q_a = require('./routes/manage_q_a');
const view_students = require('./routes/view_students');
const test_setter = require('./routes/test_setter');
const final_results = require('./routes/final_results');

var app = express();

app.set('view engine', 'ejs');
app.use('/',express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/',dashboard);
app.use('/manage_client',manage_client);
app.use('/manage_exams',manage_exams);
app.use('/manage_q_a',manage_q_a);
app.use('/view_students',view_students);
app.use('/test_setter',test_setter);
app.use('/final_results',final_results);

app.listen(3000,()=>{
    console.log("Server Connected on port 3000");
});