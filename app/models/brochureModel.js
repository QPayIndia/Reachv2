const { json } = require('express');
const sql = require('./db.js');

const BrochureModel = function(model){
    this.uid = model.uid,
    // this.socialid = model.socialid,
    this.brochureimg = model.brochureimg,
    this.name = model.name,
   
    
   
    this.createdby = model.createdby
    // this.createdon = model.createdon
}



BrochureModel.create = (model,result)=>{
   
   

    addBrochure(model).then((id)=>{
        result(null,{status:"success",message:"Brochure Inserted Successfully",data:id});
    }).catch(({

    }));
    
    
    
}

function addBrochure(model){
    console.log(model);
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO brochure_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Brochure Insert Failed due to '+err);
                    return;
                }
                console.log('Brochure Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function updateBrochure(model,productid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE brochure_master SET ? WHERE serviceid = ?",[model,productid],(err,res)=>{
                if(err){
                    
                    console.log('Brochure Update Failed due to '+err);
                    return;
                }
                console.log('Brochure Updated successfully');
                resolve(res.insertId);
            })
    });
}



BrochureModel.getData = (uid,result)=>{
    
    getBrochureData(uid).then((data)=>{
        result(null,{status:"success",message:"Brochure Data Fetched Successfully",data:data});
    })

    
}

BrochureModel.deleteBrochure = (uid,brochureid,result)=>{
    
    deleteData(uid,brochureid).then(()=>{
        result(null,{status:"success",message:"Brochure Deleted Successfully",});
    })

    
}

function getBrochureData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM brochure_master WHERE uid = ?",[uid],(err,data)=>{
            if(err){
                resolve([]);
                console.log("Get Brochure Data :"+err);
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}

function deleteData(uid,brochureid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM brochure_master WHERE brochureid = ? AND uid = ?",[brochureid,uid],(err,data)=>{
            if(err){
                reject();
                
                return;
            }
    
    
            resolve();
        })
    })
}



module.exports = BrochureModel;