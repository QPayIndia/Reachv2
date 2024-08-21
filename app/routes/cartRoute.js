module.exports = app =>{
    const cart  = require('../controllers/cartController.js');

    var router = require('express').Router();
    // router.post('/add',users.add);
    // router.post('/delete');
    // router.post('/getall');
    router.post('/addtocart',cart.add);
    router.post('/getcart',cart.getCartData);
    
    app.use('/api/cart',router);
}