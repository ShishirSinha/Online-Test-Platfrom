var express = require('express');
var pool = require('../config/database');
const moment = require('moment');
var fs = require('fs');

var app = express();

app.get('/',function(req,res){
        console.log("here on Manage Exams");
        pool.getConnection((err, conn) => {
        if(err) throw err;

        var sql="SELECT sub_id AS id, sub_name AS name FROM subject ";

        var sql1="SELECT * FROM exam WHERE date >= CURRENT_DATE() ORDER BY date";

        var sql2="SELECT id,name FROM manage_client";

        console.log(sql);

        conn.query(sql, function(err,result){
            if (err) throw err;
            console.log(result);

            conn.query(sql2,function(err,result2) {
                if(err) throw err;
                console.log(result2);

                conn.query(sql1,function(err,result1) {
                    if(err) throw err;
                    console.log(result1);

                    result1.forEach(res => {
                        res.date = moment(res.date).format('YYYY-MM-DD');
                    });

                    res.render('manage_exams.ejs',{
                        subjects:result,
                        exams:result1,
                        name:result2
                        // type:req.user.type,
                        // students:results[1],
                        // msg: req.flash('msg')
                    });

                    conn.release();
                });
            });
        });
    });
});

app.post('/add_exam',function(req,res) {
    console.log(req.body);

    // var subs = req.body.subject.split(',');

    var subs = req.body.subject.split(',');
    var temp = 0;
    console.log(req.body.subject, subs);

    var ids = subs.filter(function(sub) {
        Number.isInteger(parseInt(sub))
    });
    var subject = subs.filter(sub => !ids.includes(sub));  // doubt - purpose of this line?

    var sql1 = "SELECT name FROM exam";

    pool.getConnection(sql1, function(err,result1){
        if(err) throw err;

        for(var i=0;i<result1.length;i++) {
            if(result1[i].name == req.body.exam_name)
                temp = 1;
        }

        if(subject.length > 0) {
            let sub_temp = subject.map(sub => "('"+sub+"')");
            var query = "INSERT INTO `subject` (`sub_name`) VALUES " + sub_temp.join(', ');

            pool.getConnection((err, conn) => {
                if(err) throw err;
                
                conn.query(query, (error, result) => {
                    if(error) throw error;

                    var id = result.insertId;
                    for(var i=0 ; i<subject.length ; i++){
                        ids.push(id+1);
                    }

                    conn.release();

                    if(temp==0)
                        insertExam();
                });
            });
        }
        else{
            if(temp==0)
                insertExam();
        }
    });


    function insertExam(){

        var exam_id;

        pool.getConnection(async (err, conn) => {
            if (err) throw err;

            warnings = parseInt(req.body.warnings) + (+2);   // doubt - Why (+2) ?

            var sql = "INSERT INTO `exam` (`name`,`sub_name`,`date`,`warning`,`total_marks`,`start_time`,`duration`) VALUES ('"+req.body.exam_name+"','"+ids.toString()+"','"+req.body.date+"','"+warnings+"','"+req.body.total_marks+"','"+req.body.time+"','"+req.body.duration+")";
            
            await conn.query(sql,function(err,result) {
                if(err) throw err;

                exam_id = result.insertId;
                console.log(exam_id);

                var sql4 = "CREATE TABLE IF NOT EXISTS ques_"+exam_id+" (id int primary key auto_increment,ques varcahar(1000),op_1 varchar(1000) DEFAULT 0,op_2 varchar(1000) DEFAULT 0,op_3 varchar(1000) DEFAULT 0,op_4 varchar(1000) DEFAULT 0,ans varchar(1000),pos_marks int(11) DEFAULT 0,neg_marks int(11) DEFAULT 0,sub_name varchar(100),set_by int(11) DEFAULT 0,client_id int(11) DEFAULT 1,del int(11) DEFAULT 0)";
                conn.query(sql4, function(err,result4) {
                    if(err) throw err;
                    console.log("Question Table",result4);
                });

                var sql5 = "CREATE TABLE IF NOT EXISTS res_"+exam_id+" (id int primary key auto_increment,reg_no varchar(100) DEFAULT 0,checked int(11) DEFAULT 0)";
                conn.query(sql5, function(err,result5) {
                    if(err) throw err;
                    console.log("Response table",result5);
                });

                var dir = './public/uploads/'+'Exam_'+exam_id;
                console.log(dir);
                if(!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
            });

            conn.release();
        });
    }

    res.redirect('/manage_exams');
});

module.exports = app;