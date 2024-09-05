module.exports = app =>{
    const cart  = require('../controllers/cartController.js');

    var router = require('express').Router();
    // router.post('/add',users.add);
    // router.post('/delete');
    // router.post('/getall');
    router.post('/addtocart',cart.add);
    router.post('/getcart',cart.getCartData);
    router.post('/updatecart',cart.updateCart);
    router.post('/checkout',cart.Checkout);
    router.post('/vieworders',cart.ViewOrders);
    router.post('/getMerchantOrders',cart.GetMerchantOrders);
    router.post('/getorderdetails',cart.GetOrderDetails);
    
    app.use('/api/cart',router);
}