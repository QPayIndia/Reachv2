module.exports = app =>{
    const admin  = require('../controllers/adminMasterController.js');

    var router = require('express').Router();
    router.post('/getallmerchants',admin.getAllMerchants);
    //router.post('/addrating',business.addRating);
    
    
    app.use('/api/admin',router);
}