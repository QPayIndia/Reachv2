const { json } = require('express');
const sql = require('./db.js');

const AdminMaster = function(model){
    this.uid = model.uid
   
}



AdminMaster.getAllMerchants = (uid,result)=>{
   
    getAllMerchants().then((data)=>{
        result(null,{status:"success",message:"Merchant Data Fetched Successfully",data:data});
    }).catch(()=>{
        result(null,{status:"failure",message:"Merchants Data Fetch Failed"});
    });
    
    
    
}
AdminMaster.getPendingMerchants = (uid,result)=>{
   
    getPendingMerchants().then((data)=>{
        result(null,{status:"success",message:"Merchant Data Fetched Successfully",data:data});
    }).catch(()=>{
        result(null,{status:"failure",message:"Merchants Data Fetch Failed"});
    });
    
    
    
}

AdminMaster.getAllUsers = (uid,result)=>{
   
    getAllUsers().then((data)=>{
        result(null,{status:"success",message:"Users Data Fetched Successfully",data:data});
    }).catch(()=>{
        result(null,{status:"failure",message:"Users Data Fetch Failed"});
    });
 
}



function getAllMerchants(){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.bid as uid, A.name,B.name as owner,B.phone,C.area,A.active,DATE_FORMAT(A.cretaedon, '%d-%m-%Y') as registeredon FROM business_master as A,contact_info as B,location_master as C WHERE A.bid = B.uid AND A.bid = C.uid;",(err,res)=>{
                if(err){
                    
                    console.log('Get All Merchants Failed due to '+err);
                    return;
                }
                console.log('Get All Merchants Fetched');
                resolve(res);
            })
    });
}
function getPendingMerchants(){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.bid as uid, A.name,B.name as owner,B.phone,C.area,A.active,DATE_FORMAT(A.createdon, '%d-%m-%Y') as registeredon FROM business_master as A,contact_info as B,location_master as C,business_info as D,kyc_master as E,business_kyc as F,payment_info_master as G WHERE A.bid = B.uid AND A.bid = C.uid AND A.uid = D.uid AND A.uid = E.uid AND A.uid = F.uid AND A.uid = G.uid AND A.active = 0;",(err,res)=>{
                if(err){
                    
                    console.log('Get Pending Merchants Failed due to '+err);
                    return;
                }
                console.log('Get Pending Merchants Fetched');
                resolve(res);
            })
    });
}
function getAllUsers(){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.uid, A.name,A.phone,A.active,DATE_FORMAT(A.lastlogin, '%d-%m-%Y') as lastlogin,DATE_FORMAT(A.createdon, '%d-%m-%Y') as createdon FROM user_master as A;",(err,res)=>{
                if(err){
                    
                    console.log('Get All Users Failed due to '+err);
                    return;
                }
                console.log('Get All Users Fetched');
                resolve(res);
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




module.exports = AdminMaster;