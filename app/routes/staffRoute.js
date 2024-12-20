module.exports = app =>{
    const staff  = require('../controllers/staffController.js');
    const business  = require('../controllers/businessInfoController.js');
    
    var router = require('express').Router();
    router.post('/getallbusiness',staff.getAllBusiness);
    router.post('/adduser',staff.addUser);
    router.post('/updatebusinessstatus',staff.UpdateBusinessStatus);
    router.post('/addfollowup',staff.AddFollowUp);
    router.post('/getfollowups',staff.getFollowups);
    router.post('/addexpense',staff.AddExpense);
    router.post('/getexpense',staff.GetExpense);
    router.post('/uploadbill',staff.uploadBill);
    
    app.use('/api/staff',router);
}