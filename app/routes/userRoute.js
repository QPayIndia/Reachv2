module.exports = app =>{
    const users  = require('../controllers/userController.js');

    var router = require('express').Router();
    // router.post('/add',users.add);
    // router.post('/delete');
    // router.post('/getall');
    router.post('/addaddress',users.addUserAddress);
    app.use('/api/user',router);
}