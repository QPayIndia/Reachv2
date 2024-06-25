module.exports = app =>{
    const bookmark  = require('../controllers/bookmarkController.js');

    var router = require('express').Router();
    router.post('/add');
    router.post('/delete');
    router.post('/getbyuser');
    
    app.use('/api/bookmark',router);
}