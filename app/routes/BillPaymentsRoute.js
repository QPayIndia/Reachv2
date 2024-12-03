module.exports = app =>{
    const controller  = require('../controllers/BillPaymentsController.js');

    var router = require('express').Router();
    router.post('/getprepaidplans',controller.getPrepaidPlans);
    router.post('/getbilldetails',controller.getBillDetails);
   
   
    app.use('/api/bill',router);
}