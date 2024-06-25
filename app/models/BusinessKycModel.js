const { json } = require('express');
const sql = require('./db.js');

const BusinessKycModel = function(model){
    this.uid = model.uid,
    // this.pinfoid  = model.pinfoid,
    this.rc=model.rc,
    this.gst=model.gst,
    this.pan=model.pan,
    this.rentdeed=model.rentdeed,
    this.partnershipdeed=model.partnershipdeed,
    this.coa=model.coa,
    this.aoa=model.aoa,
    this.moa=model.moa,
    this.mgt=model.mgt,
    this.trustdeed=model.trustdeed,
    
    this.createdby = model.uid
    
}



BusinessKycModel.create = (model,result)=>{
   
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
        sql.query("INSERT INTO business_kyc SET ?",model,(err,res)=>{
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
        sql.query("UPDATE business_kyc SET ? WHERE uid = ?",[model,model.uid],(err,res)=>{
                if(err){
                    
                    console.log('KYC Info Failed due to '+err);
                    return;
                }
                console.log('KYC Info Updated successfully');
                resolve(res.insertId);
            })
    });
}



BusinessKycModel.getKYCData = (uid,result)=>{
    
    getData(uid).then((data)=>{
        result(null,{status:"success",message:"KYC Info Fetched Successfully",data:data[0]});
    })

    
}

function getData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM business_kyc WHERE uid = ? LIMIT 1",[uid],(err,data)=>{
            if(err){
                result(err,{status:"failure",message:err,data:{}});
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}



module.exports = BusinessKycModel;