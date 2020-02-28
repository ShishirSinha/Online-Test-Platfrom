var express = require('express');
var pool = require('../config/database');

var app = express();

app.get('/',function(req,res){
    console.log("here on Test Setter");
    res.render('test_setter.ejs');
});

app.post('/',function(req,res){
    console.log(req.body);
    pool.getConnection((err, conn) => {
        if (err) throw err;

        var sql = "INSERT IGNORE INTO `test_setter`(`name`,`username`,`password`,`occupation`,`exam`,`level`) VALUES ('"+req.body.name+"','"+req.body.username+"','"+req.body.password+"','"+req.body.occupation+"','"+req.body.exam+"','"+req.body.level+"')";
        console.log(sql);
        conn.query(sql, function(err,result){
            if(err) throw err;
            console.log(result);
        });

        var sql="SELECT id FROM test_setter AS a WHERE a.name='"+req.body.name+"'";
        conn.query(sql, function(err,result){
            if (err) throw err;
            console.log(result);
        })
        res.redirect('/test_setter');
    }) 
});

module.exports = app;