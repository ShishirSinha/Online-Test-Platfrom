var express = require('express');
var pool = require('../config/database');

var app = express();

app.get('/',function(req,res){
    console.log("here on Manage Clients");
    res.render('manage_client.ejs');
});

app.post('/',function(req,res){
    console.log(req.body);
    pool.getConnection((err, conn) => {
        if (err) throw err;

        var sql = "INSERT IGNORE INTO `manage_client`(`name`,`username`,`password`,`company`,`exam`,`level`) VALUES ('"+req.body.name+"','"+req.body.username+"','"+req.body.password+"','"+req.body.company+"','"+req.body.exam+"','"+req.body.level+"')";
        console.log(sql);
        conn.query(sql, function(err,result){
            if(err) throw err;
            console.log(result);
        });

        var sql="SELECT id FROM manage_client AS a WHERE a.name='"+req.body.name+"'";
        conn.query(sql, function(err,result){
            if (err) throw err;
            console.log(result);
        });
        res.redirect('/manage_client');
    }) 
});

module.exports = app;