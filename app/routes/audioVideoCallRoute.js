module.exports = app =>{
    const avc  = require('../controllers/audioVideoCallController.js');

    var router = require('express').Router();
   
    router.post('/createcall',avc.createCall);
  
    
    app.use('/api/avc',router);
}