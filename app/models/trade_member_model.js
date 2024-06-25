const { json } = require('express');
const sql = require('./db.js');

const TradeMemberModel = function(model){
    this.uid = model.uid,
    // this.pinfoid  = model.pinfoid,
    this.name=model.name,
    this.image=model.image,
   
    this.createdby = model.uid
    // this.createdon = model.createdon
}



TradeMemberModel.create = (model,result)=>{

    addInfo(model).then((id)=>{
        result(null,{status:"success",message:"Media Inserted Successfully",data:id});
    }).catch(({

    }));
   
}
TradeMemberModel.deleteInfo = ([uid,tradeid],result)=>{

    deleteInfo(uid,tradeid).then(()=>{
        result(null,{status:"success",message:"Media Delete Successfully",});
    }).catch(({

    }));
   
}

function addInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO trade_member_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Media Insert Failed due to '+err);
                    return;
                }
                console.log('Media Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function deleteInfo(uid,tradeid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM trade_member_master WHERE tradeid = ? AND uid = ?",[tradeid,uid],(err,res)=>{
                if(err){
                    
                    console.log('Trade Delete Failed due to '+err);
                    return;
                }
                console.log('Media Inserted successfully');
                resolve();
            })
    });
}
// function updateInfo(model){
//     return new Promise((resolve,reject)=>{
//         sql.query("UPDATE trade_member_master SET ? WHERE uid = ?",[model,model.uid],(err,res)=>{
//                 if(err){
                    
//                     console.log('Media Insert Failed due to '+err);
//                     return;
//                 }
//                 console.log('Media Updated successfully');
//                 resolve(res.insertId);
//             })
//     });
// }



TradeMemberModel.getInfo = (uid,result)=>{
    
    getData(uid).then((data)=>{
        result(null,{status:"success",message:"Media Fetched Successfully",data:data});
    })

    
}

function getData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM trade_member_master WHERE uid = ?",[uid],(err,data)=>{
            if(err){
                result(err,{status:"failure",message:err,data:{}});
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}



module.exports = TradeMemberModel;