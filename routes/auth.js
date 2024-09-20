const {signupController,loginController,getAllUsersController,userEditController,userDelectController} =require('../controllers/authController')
const authRout =(app)=>{
    app.post('/api/signup',signupController),
    app.post('/api/login',loginController),
    app.get('/api/users',getAllUsersController),
    app.put('/api/useredit/:id',userEditController),
    app.delete('/api/userdelect/:id',userDelectController)




}

module.exports = authRout;