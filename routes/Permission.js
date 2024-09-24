const {permissionController}=require('../controllers/permissionController')
const PermissionRout=(app)=>{
    app.post('/api/permission',permissionController)
}

module.exports= PermissionRout