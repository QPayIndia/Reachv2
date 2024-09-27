module.exports = app =>{
    const admin  = require('../controllers/businessReportsController.js');

    var router = require('express').Router();
    router.post('/getreport',admin.getReports);
  
    
    
    app.use('/api/report',router);
}