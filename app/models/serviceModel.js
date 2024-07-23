const { json } = require('express');
const sql = require('./db.js');

const ServiceModel = function(model){
    this.uid = model.uid,
    // this.socialid = model.socialid,
    this.serviceimg = model.serviceimg,
    this.name = model.name,
    this.description = model.description,
    this.category = model.category,
   
    this.pricetype = model.pricetype,
    this.price = model.price,
    
    this.units = model.units,
    this.minprice = model.minprice,
    this.maxprice = model.maxprice,
   
    this.createdby = model.createdby
    // this.createdon = model.createdon
}



ServiceModel.create = (model,result)=>{
   
   

    addService(model).then((id)=>{
        result(null,{status:"success",message:"Service Inserted Successfully",data:id});
    }).catch(({

    }));
    
    
    
}
ServiceModel.updateService = (model,serviceid,result)=>{
   
   

    updateServiceData(model,serviceid).then(()=>{
        result(null,{status:"success",message:"Service Inserted Successfully"});
    }).catch(({

    }));
    
    
    
}

function addService(model){
    console.log(model);
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO service_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Service Insert Failed due to '+err);
                    return;
                }
                console.log('Service Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function updateServiceData(model,serviceid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE service_master SET ? WHERE serviceid = ?",[model,serviceid],(err,res)=>{
                if(err){
                    
                    console.log('Service Update Failed due to '+err);
                    return;
                }
                console.log('Service Updated successfully');
                resolve();
            })
    });
}



ServiceModel.getData = (uid,result)=>{
    
    getServiceData(uid).then((data)=>{
        result(null,{status:"success",message:"Service Data Fetched Successfully",data:data});
    })

    
}

ServiceModel.deleteService = (uid,productid,result)=>{
    
    deleteData(uid,productid).then(()=>{
        result(null,{status:"success",message:"Product Deleted Successfully",});
    })

    
}

function getServiceData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM service_master WHERE uid = ?",[uid],(err,data)=>{
            if(err){
                console.log("Get Service Master : "+err);
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}

function deleteData(uid,serviceid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM service_master WHERE serviceid = ? AND uid = ?",[serviceid,uid],(err,data)=>{
            if(err){
                reject();
                
                return;
            }
    
    
            resolve();
        })
    })
}



module.exports = ServiceModel;