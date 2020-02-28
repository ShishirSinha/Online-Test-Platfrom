var express = require('express');
const moment = require('moment');
var pool = require('../config/database');

var app = express();

app.get('/',function(req,res){
    console.log("here on View Students");
    pool.getConnection((err, conn) => {
        if(err) throw err;

        var sql;
        var sql="SELECT * FROM students";

        console.log(sql);
        conn.query(sql, function(err,result){
            if (err) throw err;
            console.log(result);

            for(var i = 0; i < result.length; i++){
                var date = moment(result[i].date).format('DD-MM-YYYY');
                result[i].dob = date;
                console.log(result);
            }

            res.render('view_students.ejs',{
                students:result
                // type:req.user.type,
                // students:results[1],
                // msg: req.flash('msg')
            });
        });
        conn.release();
    });
});

app.post('/',function(req,res){
    console.log(req.body);
    pool.getConnection((err, conn) => {
        if (err) throw err;

        req.body.dob = moment(req.body.dob).format('YYYY-MM-DD');

        var sql = "INSERT IGNORE INTO `students`(`name`,`mobile`,`dob`,`qualification`,`email`,`exam`,`aadhar_no`) VALUES ('"+req.body.name+"','"+req.body.mobile+"','"+req.body.dob+"','"+req.body.qualification+"','"+req.body.email+"','"+req.body.exam+"','"+req.body.aadhar_no+"')";
        console.log(sql);
        conn.query(sql, function(err,result){
            if(err) throw err;
            console.log(result);
        });
        res.redirect('/view_students');
    }) 
});

module.exports = app;