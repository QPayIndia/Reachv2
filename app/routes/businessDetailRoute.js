module.exports = app =>{
    const business  = require('../controllers/BusinessDetailController.js');

    var router = require('express').Router();
    router.post('/getbusinessdetail',business.getDetail);
    router.post('/addrating',business.addRating);
    
    
    app.use('/api/business',router);
}