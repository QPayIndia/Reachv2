
module.exports = app =>{
    const business  = require('../controllers/businessInfoController.js');

    var router = require('express').Router();
    router.post('/contactinfo',business.create);
    router.post('/login',business.Login);
    router.post('/signup',business.Signup);
    router.post('/getdata',business.getDtaa);
    router.post('/addlocationdata',business.addlocation);
    router.post('/getlocationdata',business.getLocationData);
    router.post('/addsocialinfo',business.addSocialInfo);
    router.post('/getsocialinfo',business.getSocailInfo);
    router.post('/addpaymentinfo',business.addPaymentInfo);
    router.post('/getpaymentinfo',business.getPaymentInfo);
    router.post('/uploadcheque',business.uploadCheque);
    router.post('/uploadkyc',business.uploadkyc);
    router.post('/addkycdata',business.addKYCInfo);
    router.post('/getkycdata',business.getKYCInfo);
    router.post('/uploadbphoto',business.uploadphoto);
    router.post('/uploadpdf',business.uploadPdfFile);
    router.post('/addbphotoinfo',business.addBPicture);
    router.post('/getbphotoinfo',business.getBPicture);
    router.post('/uploadbvideo',business.uploadvideo);
    router.post('/uploadcertificate',business.uploadCertificate);
    router.post('/addtradeinfo',business.addTradeData);
    router.post('/gettradeinfo',business.getTradeData);
    router.post('/deletetradeinfo',business.deleteTradeData);
    router.post('/addaward',business.addAward);
    router.post('/getaward',business.getAward);
    router.post('/addkyb',business.addKYBInfo);
    router.post('/getkyb',business.getBusinessKYC);

    

   
    app.use('/api/business',router);
}