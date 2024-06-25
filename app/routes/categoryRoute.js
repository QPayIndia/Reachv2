module.exports = app =>{
    const categories  = require('../controllers/categorycontroller.js');

    var router = require('express').Router();
    router.post('/add',categories.create);
    router.post('/delete',categories.delete);
    router.get('/getall',categories.getAll);
    
    app.use('/api/category',router);
}