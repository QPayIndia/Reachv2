module.exports = app =>{
    const chat  = require('../controllers/chatController.js');

    var router = require('express').Router();
    router.post('/createroom',chat.createChatRoom);
    router.post('/getchatrooms',chat.getChatRooms);
    router.post('/sendFile',chat.uploadFile);
    router.post('/sendChat',chat.InsertChat);
    router.post('/getChat',chat.getChatFromRoom);
    router.post('/getunreadchats',chat.getUnreadChats);
  
    
    
    app.use('/api/chat',router);
}