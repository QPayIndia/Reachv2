module.exports = app =>{
    const payModel  = require('../controllers/paymentController.js');

    var router = require('express').Router();
   
    
    router.post('/callback',payModel.callback);
    router.get('/makepayment',payModel.pay);
   
    app.use('/api/pay',router);
}