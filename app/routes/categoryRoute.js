module.exports = app =>{
    const categories  = require('../controllers/categoryController.js');

    var router = require('express').Router();
    router.post('/add',categories.create);
    router.post('/delete',categories.delete);
    router.get('/getall',categories.getAll);
    router.post('/getmasterlist',categories.getMasterCategoryList);
    
    app.use('/api/category',router);
}