module.exports = app =>{
    const admin  = require('../controllers/adminMasterController.js');
    const business  = require('../controllers/businessInfoController.js');
    
    var router = require('express').Router();
    router.post('/getallusers',admin.getAllUsers);
    router.post('/adduser',business.Signup);
    
    app.use('/api/staff',router);
}