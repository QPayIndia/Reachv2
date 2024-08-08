module.exports = app =>{
    const users  = require('../controllers/userController.js');

    var router = require('express').Router();
    // router.post('/add',users.add);
    // router.post('/delete');
    // router.post('/getall');
    router.post('/addaddress',users.addUserAddress);
    router.post('/getaddress',users.getAllAddress);
    router.post('/deleteaddress',users.deleteAddress);
    router.post('/adduser',users.addUser);
    router.post('/getuser',users.getUser);
    app.use('/api/user',router);
}