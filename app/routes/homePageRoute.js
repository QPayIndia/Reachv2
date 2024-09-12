module.exports = app =>{
    const homePage  = require('../controllers/HomePageController.js');

    var router = require('express').Router();
    router.post('/getrentproducts',homePage.getRentalProducts);
  
    
    
    app.use('/api/home',router);
}