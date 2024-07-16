module.exports = app =>{
    const business  = require('../controllers/BusinessController.js');

    var router = require('express').Router();
    router.post('/addbusiness',business.create);
    router.post('/deletebusiness',business.deleteBusiness);
    router.post('/getallbusiness',business.getAll);
    
    app.use('/api/business',router);
}