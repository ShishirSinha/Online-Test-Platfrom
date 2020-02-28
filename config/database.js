var mysql = require('mysql');

var pool =mysql.createPool({multipleStatements:true,
    host:'localhost',
    user:'root',
    password:'baba3901',
    database:'test'
});

pool.getConnection((err,db)=>{
    if(err)
    {
        throw err;
    }
    console.log("SQL Connected");
    db.release();
});

module.exports = pool;