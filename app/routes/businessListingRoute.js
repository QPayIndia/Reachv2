module.exports = app =>{
    const business  = require('../controllers/BusinessListingController.js');

    var router = require('express').Router();
    router.post('/getListing',business.getListing);
    
    
    app.use('/api/business',router);
}