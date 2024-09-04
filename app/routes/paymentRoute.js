module.exports = app =>{
    const payModel  = require('../controllers/paymentController.js');

    var router = require('express').Router();
   
    
    router.post('/callback',payModel.callback);
    router.all('/makepayment',payModel.pay);
    router.all('/createpayment',payModel.CreatePayment);
    router.all('/getpaymentdetails',payModel.GetPaymentDetails);
    router.all('/gettransactions',payModel.GetTransactions);
   
    app.use('/api/pay',router);
}