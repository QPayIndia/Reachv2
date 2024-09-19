module.exports = app =>{
    const chat  = require('../controllers/chatController.js');

    var router = require('express').Router();
    router.post('/createroom',chat.createChatRoom);
    router.post('/getchatrooms',chat.getChatRooms);
    router.post('/sendFile',chat.uploadFile);
  
    
    
    app.use('/api/chat',router);
}