const { json } = require('express');
const sql = require('./db.js');

const OwnerModel = function(model){
    this.uid = model.uid,
    //this.ownerid = model.ownerid,
    this.isprimary = model.isprimary,
    this.nameprefix = model.nameprefix,
    this.name = model.name,
    this.designation = model.designation,
    //this.createdon = model.createdon,
    this.createdby = model.createdby
}



OwnerModel.create = (model,ownerid,result)=>{

    if(ownerid === 0){
        addOwnerModel(model).then((id)=>{
            result(null,{status:"success",message:"Owner Inserted Successfully",data:id});
        }).catch((err)=>{
            result(err,{status:"failure",message:"Owner Insert Failed"});
        });
    }else{
        
        
        updateOwnerModel(model,ownerid).then((id)=>{
            result(null,{status:"success",message:"Owner Updated Successfully",data:id});
        }).catch((err)=>{
            console.log(err);
            result(err,{status:"failure",message:"Owner Update Failed"});
        });
    }
   
    
    
    
    
}
OwnerModel.deleteOwner = (uid,ownerid,result)=>{
   
    deleteData(uid,ownerid).then((id)=>{
        result(null,{status:"success",message:"Owner Deleted Successfully",data:id});
    }).catch(({

    }));
    
    
    
}

function addOwnerModel(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO owner_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Owner Insert Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Owner Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function updateOwnerModel(model,ownerid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE owner_master SET ? WHERE ownerid = ?",[model,ownerid],(err,res)=>{
                if(err){
                    
                    console.log('Owner Update Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Owner Updated successfully');
                resolve(ownerid);
            })
    });
}



function deleteData(uid,ownerid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM owner_master WHERE ownerid = ? AND uid = ?",[ownerid,uid],(err,data)=>{
            if(err){
                reject();
                
                return;
            }
    
    
            resolve();
        })
    })
}




module.exports = OwnerModel;