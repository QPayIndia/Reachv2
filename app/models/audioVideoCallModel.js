const { json } = require('express');
const sql = require('./db.js');
const crypto = require('crypto');
const ChatModel = require('./chatModel.js');

const AudioVideoCallModel = function(model){
    this.hostid = model.hostid,
    this.hosttype = model.hosttype,
    this.guestid = model.guestid,
    this.guesttype = model.guesttype,
    this.createdby = model.hostid,
    this.callid = model.hostid,
    this.calltype = model.calltype
   
   
}

const MessageModel = function(model){
    this.roomid = model.roomid,
    this.senderid = model.senderid,
    this.sendertype = model.sendertype,
    this.message = model.message,
    this.media = model.media,
    this.mediatype = model.mediatype
    
}



const tag = 'Audio Video Call'



AudioVideoCallModel.create = (model,result)=>{
   
    const callid = crypto.randomBytes(10);
    model.callid = callid.toString('hex');

    _createCall(model).then(()=>{
        ChatModel.getRoomId(model.hostid,model.hosttype,model.guestid,model.guesttype,(err,data)=>{
            if(err){
                result(err,{status:"failure",message:"Call Create Failed",callid:''});
            }
            else
                {
                    const msg = new MessageModel({
                        roomid : data['roomid'],
                        senderid : model.hostid,
                        sendertype : model.hosttype,
                        message : '',
                        media : model.callid,
                        mediatype : 'videocall'
                    });
                
                    ChatModel.insertChat(msg,(err,data)=>{
                        if(err){
                            result(err,{status:"failure",message:"Call Create Failed",callid:''});
                        }
                        else
                        result(null,{status:"success",message:"Call Created Successfully",callid:model.callid});
                    });
                }
        });
        
        
    }).catch((err)=>{
        result(err,{status:"failure",message:"Call Create Failed",callid:''});
    });
    
    
    
}

function _createCall(model){
   
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO audio_video_call_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log(`${tag} Insert Failed due to `+err);
                    return;
                }
                console.log(`${tag} Inserted successfully`);
                resolve(res.insertId);
            })
    });
}




module.exports = AudioVideoCallModel;