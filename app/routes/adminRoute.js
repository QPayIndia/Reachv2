module.exports = app =>{
    const admin  = require('../controllers/adminMasterController.js');

    var router = require('express').Router();
    router.post('/getallmerchants',admin.getAllMerchants);
    router.post('/getpendingmerchants',admin.getPendingMerchants);
    router.post('/getallusers',admin.getAllUsers);
    router.post('/updatemerchantstatus',admin.updateMerchantActiveStatus);
    //router.post('/addrating',business.addRating);
    
    
    app.use('/api/admin',router);
}