
module.exports = app =>{
    const business  = require('../controllers/businessInfoController.js');

    var router = require('express').Router();
    router.post('/contactinfo',business.create);
    router.post('/getcontactnumbers',business.getBusinessPhoneNumbers);
    router.post('/getbusinessowners',business.getBusinessOwners);
    router.post('/login',business.Login);
    router.post('/signup',business.Signup);
    router.post('/getdata',business.getDtaa);
    router.post('/addlocationdata',business.addlocation);
    router.post('/getlocationdata',business.getLocationData);
    router.post('/getdistricts',business.getDistircts);
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
    router.post('/uploadkybphoto',business.uploadKYBPhoto);
    router.post('/addbphotoinfo',business.addBPicture);
    router.post('/getbphotoinfo',business.getBPicture);
    router.post('/uploadbvideo',business.uploadvideo);
    router.post('/uploadbvideothumb',business.uploadthumbnail);
    router.post('/uploadcertificate',business.uploadCertificate);
    router.post('/addtradeinfo',business.addTradeData);
    router.post('/gettradeinfo',business.getTradeData);
    router.post('/deletetradeinfo',business.deleteTradeData);
    router.post('/addaward',business.addAward);
    router.post('/getaward',business.getAward);
    router.post('/addkyb',business.addKYBInfo);
    router.post('/getkyb',business.getBusinessKYC);
    router.post('/addbinfo',business.addBusinessInfo);
    router.post('/getbinfo',business.getBusinessInfo);
    router.post('/getsubcategory',business.getSubCategory);
    router.post('/addbusinesstimings',business.addBusinessTiming);
    router.post('/addproduct',business.addProduct);
    router.post('/updateproduct',business.updateProduct);
    router.post('/getproduct',business.getProducts);
    router.post('/getproductspec',business.getProductSpec);
    router.post('/deleteproductspec',business.deleteProductSpec);
    router.post('/deleteproduct',business.deleteProduct);
    router.post('/addservice',business.addService);
    router.post('/updateservice',business.updateService);
    router.post('/getservice',business.getService);
    router.post('/deleteservice',business.deleteService);
    router.post('/addbrochure',business.addBrochure);
    router.post('/getbrochure',business.getBrochure);
    router.post('/deletebrochure',business.deleteBrochure);
    router.post('/addowner',business.addOwner);
    router.post('/deleteowner',business.deleteOwner);
    router.post('/addphone',business.addPhone);
    router.post('/deletephone',business.deletePhone);
	router.post('/deleteaward',business.deleteAward);
    router.post('/deletecertificate',business.deletCertificate);
	router.post('/getbusinessinfoprogress',business.getBusinessInfoProgress);
	router.post('/addmanpower',business.addManPowerData);
	router.post('/getmanpower',business.getManPowerData);
	router.post('/deletemanpower',business.deleteManPowerData);
	router.post('/addbusinesscategory',business.addBusinessCategory);
	router.post('/getbusinesscategory',business.getAllBusinessCategory);
	router.post('/deletebusinesscategory',business.deleteBusinessCategory);
	router.post('/addbusinesssubcategory',business.addBusinessSubCategory);
	router.post('/getbusinesssubcategory',business.getBusinessSubCategory);
	router.post('/deletebusinesssubcategory',business.deleteSubCategory);

    

   
    app.use('/api/business',router);
}