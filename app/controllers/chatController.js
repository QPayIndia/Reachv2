const ChatModel = require("../models/chatModel");
const multer = require('multer');
const path = require('path');

const MessageModel = function(model){
    this.roomid = model.roomid,
    this.senderid = model.senderid,
    this.sendertype = model.sendertype,
    this.message = model.message,
    this.media = model.media,
    this.mediatype = model.mediatype
    
}


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

exports.getUnreadChats = (req,res)=>{
   
    ChatModel.getUnreadMessage(req.body.roomid,req.body.chatid,req.body.userid,(err,data)=>{
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

exports.InsertChat = (req,res)=>{

    const model = new MessageModel({
        roomid : req.body.roomid,
        senderid : req.body.senderid,
        sendertype : req.body.sendertype,
        message : req.body.message,
        media : req.body.media,
        mediatype : req.body.mediatype
    });

    ChatModel.insertChat(model,(err,data)=>{
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


exports.getChatFromRoom = (req,res)=>{
   
  
    ChatModel.getChatsFromRoom(req.body.roomid,req.body.userid,(err,data)=>{
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


exports.uploadFile = (req,res)=>{

    var ext = "";
    var img = "";

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
             ext = path.extname(file.originalname);
            if(ext === ".png" || ext === ".jpg" || ext === ".jpeg"){
                cb(null, 'uploads/chat/image');
            }else if (ext === ".mp3"){
                cb(null, 'uploads/chat/audio');
            }else if (ext === ".mp4"){
                cb(null, 'uploads/chat/video');
            }else{
                cb(null, 'uploads/chat/file');
            }
         
        },
        filename: function(req, file, cb) {
            
          cb(null, Date.now() +path.extname(file.originalname));
        }
      });
      
      const upload = multer({ storage: storage });
      upload.single('file')(req,res,function (err){
        if (err instanceof multer.MulterError) {
            return res.status(400).json({status:false, message: 'File upload error', error: err });
          } else if (err) {
            return res.status(500).json({status:false, message: 'Server error', error: err });
          }
      
          if (!req.file) {
            return res.status(400).json({ message: 'No files were uploaded.' });
          }
          if(ext === ".png" || ext === ".jpg" || ext === ".jpeg"){
            img = "/uploads/chat/image/"+req.file.filename;
        }else if (ext === ".mp3"){
            img = "/uploads/chat/audio/"+req.file.filename;
        }else if (ext === ".mp4"){
            img = "/uploads/chat/video/"+req.file.filename;
        }else{
            img = "/uploads/chat/file/"+req.file.filename;
        }
          
          res.status(200).send({status:"success",message:"File Uploaded Successfully",data : img});
            
      });
}





