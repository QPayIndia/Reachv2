const { json } = require('express');
const sql = require('./db.js');

const IndividualKycModel = function(model){
    this.uid = model.uid,
    // this.pinfoid  = model.pinfoid,
    this.photo=model.photo,
    this.aadhar=model.aadhar,
    this.frontaadhar=model.frontaadhar,
    this.backaadhar=model.backaadhar,
    this.pan=model.pan,
    this.frontpan=model.frontpan,
    this.backpan=model.backpan,
    
    this.createdby = model.uid
    
}



IndividualKycModel.create = (model,result)=>{
   
    getData(model.uid).then((data)=>{
        if(data.length > 0){
            console.log("Info Already present")
            updateInfo(model).then((id)=>{
                result(null,{status:"success",message:"KYC Info Inserted Successfully",data:id});
            }).catch(({
        
            }));
        }else{
            addKYCInfo(model).then((id)=>{
                result(null,{status:"success",message:"KYC Info Inserted Successfully",data:id});
            }).catch(({
        
            }));
        }
    })
    
    
    
}

function addKYCInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO kyc_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('KYC Info Failed due to '+err);
                    return;
                }
                console.log('KYC Info Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function updateInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE kyc_master SET ? WHERE uid = ?",[model,model.uid],(err,res)=>{
                if(err){
                    
                    console.log('KYC Info Failed due to '+err);
                    return;
                }
                console.log('KYC Info Updated successfully');
                resolve(res.insertId);
            })
    });
}



IndividualKycModel.getKYCData = (uid,result)=>{
    
    getData(uid).then((data)=>{
        result(null,{status:"success",message:"KYC Info Fetched Successfully",data:data[0]});
    })

    
}

function getData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM kyc_master WHERE uid = ? LIMIT 1",[uid],(err,data)=>{
            if(err){
                result(err,{status:"failure",message:err,data:{}});
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}



module.exports = IndividualKycModel;