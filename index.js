require("dotenv").config();
const express = require('express');
const authRout = require('./routes/auth');
const taskRout =require('./routes/task');
const PermissionRout = require("./routes/Permission");
const app = express();
const port = 8090;
app.use(express.json());
authRout(app);
taskRout(app)
PermissionRout(app)




app.listen(port,()=>{
    console.log(`Port Listening at :- https://localhost:${port}`)
})

