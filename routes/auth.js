const {signupController,loginController,getAllUsersController,userEditController,userDelectController,permissionController} =require('../controllers/authController')
const authRout =(app)=>{
    app.post('/api/signup',signupController),
    app.post('/api/login',loginController),
    app.get('/api/users',getAllUsersController),
    app.put('/api/useredit/:id',userEditController),
    app.delete('/api/userdelect/:id',userDelectController),
    app.post('/api/permission',permissionController)

}

module.exports = authRout;