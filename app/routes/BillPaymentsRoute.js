module.exports = app =>{
    const controller  = require('../controllers/BillPaymentsController.js');

    var router = require('express').Router();
    router.post('/getprepaidplans',controller.getPrepaidPlans);
    router.post('/getbilldetails',controller.getBillDetails);
    router.post('/getoperators',controller.getOperators);
    router.post('/init',controller.initTransaction);
    router.post('/checkout',controller.Checkout);
    router.post('/getloanproviders',controller.getLoanProviders);
    router.post('/getcreditcardproviders',controller.getCreditCardProviders);
    router.post('/validatecard',controller.ValidateCard);
    router.post('/paycard',controller.PayCreditCard);
    router.post('/getrechargeplans',controller.getRechargePlans);
    router.post('/getoperatordetail',controller.GetOperatorDetails);
   
   
    app.use('/api/bill',router);
}