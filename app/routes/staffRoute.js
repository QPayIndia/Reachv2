module.exports = app =>{
    const staff  = require('../controllers/staffController.js');
    const business  = require('../controllers/businessInfoController.js');
    
    var router = require('express').Router();
    router.post('/getallbusiness',staff.getAllBusiness);
    router.post('/adduser',staff.addUser);
    router.post('/updatebusinessstatus',staff.UpdateBusinessStatus);
    
    app.use('/api/staff',router);
}