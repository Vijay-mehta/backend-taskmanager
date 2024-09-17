const {signupController,loginController} =require('../controllers/authController')
const authRout =(app)=>{
    app.post('/api/signup',signupController),
    app.post('/api/login',loginController)

}

module.exports = authRout;