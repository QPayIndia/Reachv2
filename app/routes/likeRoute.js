module.exports = app =>{
    const players  = require('../controllers/Likecontroller.js');

    var router = require('express').Router();
    router.post('/add');
    router.post('/delete');
   
    app.use('/api/likes',router);
}