module.exports = app =>{
    const chat  = require('../controllers/chatController.js');

    var router = require('express').Router();
    router.post('/createroom',chat.createChatRoom);
    router.post('/getchatrooms',chat.getChatRooms);
  
    
    
    app.use('/api/chat',router);
}