module.exports = app =>{
    const users  = require('../controllers/userController.js');

    var router = require('express').Router();
    // router.post('/add',users.add);
    // router.post('/delete');
    // router.post('/getall');
    router.post('/addaddress',users.addUserAddress);
    router.post('/getaddress',users.getAllAddress);
    router.post('/getprimaryaddress',users.getPrimaryAddress);
    router.post('/updateprimaryaddress',users.updatePrimaryAddress);
    router.post('/deleteaddress',users.deleteAddress);
    router.post('/adduser',users.addUser);
    router.post('/updatename',users.updateName);
    router.post('/updateemail',users.updateEmail);
    router.post('/updatedob',users.updateDOB);
    router.post('/getuser',users.getUser);
    router.post('/sendotp',users.SendOTP);
    router.post('/verifyotp',users.VerifyOTP);
    app.use('/api/user',router);
}