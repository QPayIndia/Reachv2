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



OwnerModel.create = (model,result)=>{
   
    addOwnerModel(model).then((id)=>{
        result(null,{status:"success",message:"Owner Inserted Successfully",data:id});
    }).catch(({

    }));
    
    
    
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
                    return;
                }
                console.log('Owner Inserted successfully');
                resolve(res.insertId);
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