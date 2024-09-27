const { createTaskController,getAllTaskController } = require("../controllers/taskController")

const taskRout=(app)=>{
    app.post('/api/createtask',createTaskController),
    app.get('/api/getalltask/:id',getAllTaskController)

}

module.exports = taskRout