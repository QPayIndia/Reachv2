module.exports = app =>{
    const users  = require('../controllers/userController.js');

    var router = require('express').Router();
    router.post('/add',users.add);
    router.post('/delete');
    router.post('/getall');
    router.post('/login',users.login);
    app.use('/api/user',router);
}