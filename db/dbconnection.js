const mysql =require('mysql');
const connction=mysql.createConnection({
    host: 'localhost',  
    user: 'root',       
    password: 'root',  
    database: 'task_manager',  
    connectionLimit: 10
})

connction.connect((err,res,field)=>{
    if(err)  throw err;
    console.log(` DB Connected successfully! `)
})

module.exports=connction;