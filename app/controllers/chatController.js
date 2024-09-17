const ChatModel = require("../models/chatModel");


exports.createChatRoom = (req,res)=>{
   
    const model = new ChatModel({
        hostid :req.body.hostid,
        hosttype :req.body.hosttype,
        guestid :req.body.guestid,
        guesttype :req.body.guesttype,
        createdby :req.body.hostid,
    });
    ChatModel.createChatRoom(model,(err,data)=>{
        if(err){
            res.status(500).send({
                message:
                  err.message || "Something went wrong."
              });
        }
        else
            res.status(200).send(data);
    });

   
};

exports.getChatRooms = (req,res)=>{
   
  
    ChatModel.getChatRooms(req.body.userid,req.body.usertype,(err,data)=>{
        if(err){
            res.status(500).send({
                message:
                  err.message || "Something went wrong."
              });
        }
        else
            res.status(200).send(data);
    });

   
};




