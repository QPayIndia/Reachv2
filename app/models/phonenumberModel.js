const { json } = require('express');
const sql = require('./db.js');

const PhoneNumberModel = function(model){
    this.uid = model.uid,
    // this.uid = model.uid,
    //this.phoneid = model.phoneid,
    this.phone = model.phone,
    this.isprimary = model.isprimary,
    this.search = model.search,
    this.notification = model.notification,
    
    
    //this.createdon = model.createdon,
    this.createdby = model.uid
}



PhoneNumberModel.create = (model,phoneid,result)=>{

    if(phoneid === 0){
        addPhoneNumber(model).then((id)=>{
            result(null,{status:"success",message:"Phone Number Inserted Successfully",data:id});
        }).catch((err)=>{
            result(err,{status:"failure",message:"Phone Number Insert Failed"});
        });
    }else{
        
        updatePhoneNumber(model,phoneid).then((id)=>{
            result(null,{status:"success",message:"Phone Number Updated Successfully",data:id});
        }).catch((err)=>{
            result(err,{status:"failure",message:"Phone Number Update Failed"});
        });
       
    }
   
    
    
    
    
}
PhoneNumberModel.deletePhoneNumber = (uid,phoneid,result)=>{
   
    deleteData(uid,phoneid).then((id)=>{
        result(null,{status:"success",message:"Phone Number Deleted Successfully",data:id});
    }).catch(({

    }));
    
    
    
}

function addPhoneNumber(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO phone_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Phone Insert Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Phone Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function updatePhoneNumber(model,phoneid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE phone_master SET ? WHERE phoneid = ?",[model,phoneid],(err,res)=>{
                if(err){
                    
                    console.log('Phone Update Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Phone Updated successfully');
                resolve(phoneid);
            })
    });
}



function deleteData(uid,ownerid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM phone_master WHERE phoneid = ? AND uid = ?",[ownerid,uid],(err,data)=>{
            if(err){
                reject(err);
                
                return;
            }
    
    
            resolve();
        })
    })
}




module.exports = PhoneNumberModel;