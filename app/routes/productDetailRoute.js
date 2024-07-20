module.exports = app =>{
    const product  = require('../controllers/ProductDetailController.js');

    var router = require('express').Router();
    router.post('/getdetail',product.getDetail);
    router.post('/addrating',product.addRating);
    
    
    app.use('/api/product',router);
}