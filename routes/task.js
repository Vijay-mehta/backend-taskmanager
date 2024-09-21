const { createTaskController } = require("../controllers/taskController")

const taskRout=(app)=>{
    app.post('/api/createtask',createTaskController)

}

module.exports = taskRout