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


function addOwnerModel(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO owner_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Owner Insert Failed due to '+err);
                    reject();
                    return;
                }
                console.log('Owner Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function getAllMerchants(){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.bid as uid, A.name,B.name as owner,B.phone,C.area,A.active,A.cretaedon as registeredon FROM business_master as A,contact_info as B,location_master as C WHERE A.bid = B.uid AND A.bid = C.uid;",(err,res)=>{
                if(err){
                    
                    console.log('Get All Merchants Failed due to '+err);
                    return;
                }
                console.log('Get All Merchants Fetched');
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