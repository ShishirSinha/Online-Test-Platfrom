var express = require('express');
const moment = require('moment');
var pool = require('../config/database');

var app = express();

app.get('/',function(req,res){
    console.log("here on QnA");
    pool.getConnection((err, conn) => {
        if (err) throw err;
  
        var sql="SELECT a.id AS exam_id, a.name AS exam_name, a.total_marks AS total_marks, a.duration AS duration,a.date AS date, a.start_time AS start_time FROM exam AS a";
  
        var sql2="SELECT id,name FROM manage_client";
  
        conn.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
            for(var i = 0; i < result.length; i++){
                var date1 = moment(result[i].date).format('DD-MM-YYYY');
                result[i].date = date1;
                console.log(result);
            }
            conn.query(sql2,function(err,result2){
                if(err)throw err;
                res.render('manage_q_a.ejs',{
                    user:result,
                    name:result2
                });
            });
        });
        conn.release();
    });
});

app.post('/edit',function(req,res){
    console.log(req.body);
    pool.getConnection((err, conn) => {
        if (err) throw err;

        var sql="SELECT id,ques,op_1,op_2,op_3,op_4,ans,pos_marks,neg_marks,sub,del FROM ques_1 ORDER BY sub";
    
        console.log(sql);
        conn.query(sql,function(err,result){
            if(err)throw err;
            console.log(result);

            res.render('manage_qa_edit.ejs',{
               ques:result
            });
            // var sql2="SELECT a.sub_id AS sub_id,a.sub_name AS sub_name FROM subject AS a";
            // conn.query(sql2,function(err,result2){
            //     // console.log(result2);
            //     var sql4="SELECT SUM(pos_marks) cal_marks FROM quest_"+req.session.exam_id+" WHERE set_by="+req.user.user_id+" AND del="+0+"";
            
            //     conn.query(sql4,function(err,result4){
            //         if(err)throw err;
            //         var sql5="SELECT COUNT(*) AS count FROM quest_"+req.session.exam_id+" WHERE client_id='"+req.user.client_id+"' AND del="+0+"";
                    
            //         conn.query(sql5,function(err,result5){
            //             // console.log(result4,req.session.total_marks);
            //             res.render('manage_qa_edit.ejs',{
            //                 ques:result,
            //                 marks:result4,
            //                 subject_exam:req.session.subject,
            //                 total_marks:req.session.total_marks,
            //                 id:4,
            //                 subject_all:result2,
            //                 type:req.user.type,
            //                 confirm:req.session.confirm,
            //                 exam_id:req.session.exam_id,
            //                 count:result5[0].count
            //             });
            //         });
            //     });
            // });
        });
        conn.release();
    });
});

app.post('/edit/addObj',function(req,res){
    console.log(req.body);
    pool.getConnection((err, conn) => {
        if (err) throw err;

        var sql = "INSERT IGNORE INTO `ques_1`(`ques`,`op_1`,`op_2`,`op_3`,`op_4`,`ans`,`pos_marks`,`neg_marks`,`sub`) VALUES ('"+req.body.ques+"','"+req.body.op_1+"','"+req.body.op_2+"','"+req.body.op_3+"','"+req.body.op_4+"','"+req.body.ans+"','"+req.body.pos_marks+"','"+req.body.neg_marks+"','"+req.body.sub+"')";
        console.log(sql);
        conn.query(sql, function(err,result){
            if(err) throw err;
            console.log(result);
        });
        res.redirect(307,'/manage_q_a/edit');
    }) 
});


module.exports = app;