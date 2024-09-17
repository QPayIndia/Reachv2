const { json } = require('express');
const sql = require('./db.js');
const crypto = require('crypto');
const { log } = require('console');


const ChatModel = function(model){
    this.hostid = model.hostid,
    this.hosttype = model.hosttype,
    this.guestid = model.guestid,
    this.guesttype = model.guesttype,
    this.createdby = model.createdby,
    this.roomkey = ''
    
}





ChatModel.createChatRoom = (model,result)=>{

    let hashValue = createHash(model.hostid+model.hosttype,model.guestid+model.guesttype);
    
    _getHashValue(hashValue).then((data)=>{
       
            if(data.length > 0){
                result(null,{status:"success",message:"Room ID Fetched Successfully",roomid:data[0]['roomid']});
            }else{
                model.roomkey = hashValue;
                _createChatRoom(model).then((id)=>{
       
                    result(null,{status:"success",message:"Room ID created Successfully",roomid:id});
              
            }).catch((err)=>{
                console.log("Host ------> "+hostid);
                console.log("Host Type ------> "+hosttype);
                console.log("Guest ------> "+guesttype);
                console.log("Guest Type ------> "+guestid);
                
                console.log("Room Cannnot be created "+err);
                
                 result(err,{status:"failure",message:"Something went wrong",roomid:0});
            })
            }
      
    }).catch((err)=>{
                console.log("Host ------> "+hostid);
                console.log("Host Type ------> "+hosttype);
                console.log("Guest ------> "+guesttype);
                console.log("Guest Type ------> "+guestid);
        console.log("Room Cannnot be fetched "+err);
        result(err,{status:"failure",message:"Something went wrong",roomid:0});
    })

    
}
ChatModel.getChatRooms = (userid,usertype,result)=>{

   
    _getChatRooms(userid).then(async (data)=>{

        let _rows = [];
        let j = 0;
       
       for(let i = 0 ; i< data.length ; i++){
        let _temp = {};
        _temp.roomkey = data[i]['roomkey'];
        _temp.roomid = data[i]['roomid'];
            if(data[i]['hostid'] === userid && data[i]['hosttype'] === usertype){
                let guestid = data[i]['guestid'];
                if(data[i]['guesttype'] === 'merchant'){
                  _temp.name = data[i]['guestBName'];
                  _temp.profile = data[i]['guestBProfile'];
                  _temp.type = "merchant";

                 
                }else{
                    _temp.name = data[i]['guestUName'];
                    _temp.profile = data[i]['guestUProfile'];
                    _temp.type = "user";
                }
                _rows[j] = _temp;
                j++;
            } else  if(data[i]['guestid'] === userid && data[i]['guesttype'] === usertype){
                let guestid = data[i]['hostid'];
                if(data[i]['hosttype'] === 'merchant'){
                   
                        _temp.name = data[i]['hostBName'];
                        _temp.profile = data[i]['hostBProfile'];
                        _temp.type = "merchant";
     
                      
                     }else{
                        _temp.name = data[i]['hostUName'];
                        _temp.profile = data[i]['hostUProfile'];
                        _temp.type = "user";
                     
                }
                _rows[j] = _temp;
                j++;
            }
           
        };

        await sleep(100);
        result(null,{status:"success",message:"Chat Room Fetched Successfully",data:_rows});
        
      
    }).catch((err)=>{
                console.log("Host ------> "+userid);
                
        console.log(" Chat Room Cannnot be fetched "+err);
        result(err,{status:"failure",message:"Something went wrong",roomid:0});
    })

    
}

function createHash(value1, value2) {
   
    const sortedValues = [value1, value2].sort();
    const concatenatedValues = sortedValues.join('|');  
    const hash = crypto.createHash('sha256').update(concatenatedValues).digest('hex');
  
    return hash;
  }



function _createChatRoom(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO chat_room_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Chat Room Create Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Chat Room Inserted successfully -----> '+res.insertId);
                
                resolve(res.insertId);
            })
    });
}
function _generateData(data){
    return new Promise((resolve,reject)=>{
        for(let i = 0 ; i< data.length ; i++){
            if(data[i]['hostid'] === userid){
                let guestid = data[i]['guestid'];
                if(data[i]['guesttype'] === 'merchant'){
                    sql.query("SELECT * FROM business_info WHERE uid = ?",guestid,async (err,res)=>{
                        if(err){
                            
                            console.log('Chat Room Create Failed due to '+err);
                           
                            return;
                        }
                       
                        if(res.length > 0){
                            data[i]['profile'] = res[0]['profile'];
                            data[i]['name'] = res[0]['name'];
                        }

                        await sleep(1000);
                        
                    })
                }
            } else  if(data[i]['guestid'] === userid){
                let guestid = data[i]['hostid'];
                if(data[i]['hosttype'] === 'merchant'){
                    sql.query("SELECT * FROM business_info WHERE uid = ?",guestid,async (err,res)=>{
                        if(err){
                            
                            console.log('Chat Room Create Failed due to '+err);
                           
                            return;
                        }
                       
                        if(res.length > 0){
                            data[i]['profile'] = res[0]['profile'];
                            data[i]['name'] = res[0]['name'];
                        }

                        await sleep(1000);
                        
                    })
                }
            }
            
            resolve(data);
        };
        
    });
}


function _getHashValue(hash){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT roomkey,roomid FROM chat_room_master WHERE roomkey = ?;",[hash],(err,data)=>{
                if(err){
                    reject();
                    console.log('Room Key Fetch Failed due to '+err);
                    return;
                }
                console.log('Room Key Fetched successfully');
				
			
                resolve(data);
            })
    });
}
function _getChatRooms(userid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.roomkey,A.roomid,A.hostid,A.guestid,A.hosttype,A.guesttype,B.name as hostBName,C.name as guestBName,B.profile as hostBProfile,C.profile as guestBProfile,D.name as hostUName,E.name as guestUName,D.photo as hostUProfile,E.photo as guestUProfile FROM chat_room_master as A LEFT JOIN business_info as B ON A.hostid = B.uid LEFT JOIN business_info as C ON A.guestid = C.uid LEFT JOIN user_master as D ON A.hostid = D.uid LEFT JOIN user_master as E ON A.guestid = E.uid WHERE A.hostid = ? OR A.guestid = ?;",[userid,userid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Chat Room Fetch Failed due to '+err);
                    return;
                }
                console.log('Chat Room Fetched successfully');
				
			
                resolve(data);
            })
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }







module.exports = ChatModel;