module.exports = app =>{
    const payModel  = require('../controllers/paymentController.js');
    const AepsModel  = require('../controllers/aepsController.js');

    var router = require('express').Router();
   
    
    router.post('/callback',payModel.callback);
    router.all('/makepayment',payModel.pay);
    router.all('/createpayment',payModel.CreatePayment);
    router.all('/getpaymentdetails',payModel.GetPaymentDetails);
    router.all('/gettransactions',payModel.GetTransactions);
    router.post('/initaeps',AepsModel.InitAEPS);
   
    app.use('/api/pay',router);
}