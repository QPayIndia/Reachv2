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
                result(null,{status:"success",message:"KYC Info Updated Successfully",data:id});
            }).catch((err)=>{
                result(err,{status:"failure",message:"KYC Info Update Failed",data:0});
            });
        }else{
            addKYCInfo(model).then((id)=>{
                result(null,{status:"success",message:"KYC Info Inserted Successfully",data:id});
            }).catch((err)=>{
                result(err,{status:"failure",message:"KYC Info Insert Failed",data:0});
            });
        }
    }).catch((err)=>{
        result(err,{status:"failure",message:"KYC Info Insert Failed",data:0});
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
    
    getBusinessInfo(uid).then((type)=>{
        getData(uid).then((data)=>{
            result(null,{status:"success",message:"KYC Info Fetched Successfully",businessType: type.length > 0 ?  type[0]['type'] : "",data:data.length > 0 ? data[0] : {}});
        }).catch((err)=>{
            result(err,{status:"failure",message:"KYC Info Fetch Failed",businessType:"",data:[]});
        })
    }).catch((err)=>{
        result(err,{status:"failure",message:"KYC Info Fetch Failed",data:[],businessType:""});
    })

    
}

function getData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.kycid, A.rc,A.gst,A.pan,A.rentdeed,A.partnershipdeed,A.coa,A.aoa,A.moa,A.mgt,A.trustdeed,B.type as businessType,A.verifyFlag,A.createdon FROM business_kyc as A,business_info as B WHERE A.uid = ? AND A.uid = B.uid LIMIT 1;",[uid],(err,data)=>{
            if(err){
                console.log('business_kyc Failed due to '+err);
                reject(err);
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}


function getBusinessInfo(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT type FROM business_info WHERE uid = ? LIMIT 1",[uid],(err,data)=>{
            if(err){
				console.log("Business Info Model "+err);
                resolve([]);
				
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}



module.exports = BusinessKycModel;