module.exports = app =>{
    const payModel  = require('../controllers/paymentController.js');

    var router = require('express').Router();
   
    
    router.post('/callback',payModel.callback);
    router.all('/makepayment',payModel.pay);
    router.all('/createpayment',payModel.CreatePayment);
   
    app.use('/api/pay',router);
}