const { json } = require('express');
const sql = require('./db.js');

const StaffModel = function(model){
    this.uid = model.uid
   
}


StaffModel.InsertBMap = (model,result)=>{
    _insertBMap(model).then((data)=>{
        result(null,{status:"success",message:"BMap created Successfully",bmapid:data});
    }).catch((err)=>{
        result(err,{status:"failure",message:"Data create Failed"});
    });
    
}





StaffModel.getAllBusiness = (userid,result)=>{
   
    _getAllBusiness(userid).then((data)=>{
        result(null,{status:"success",message:"Merchant Data Fetched Successfully",data:data});
    }).catch(()=>{
        result(null,{status:"failure",message:"Merchant Data Fetch Failed"});
    });
 
}




StaffModel.login = (phone,password,result)=>{
    sql.query("SELECT COUNT(*) as count,phone,password,uid FROM user_master WHERE phone = ? AND usertype = 1",[phone,password],(err,results)=>{
        if(err){
            
            console.log('Cannot find User due to '+err);
            return;
        }
        if(results[0]['password'] == "" || results[0]['password'] == null){
            result(null,{status:"failure",message:"User doesn't exist"});
        }
        else if(results[0]['password'] != password){
            result(null,{status:"failure",message:"Password doen't match"});
        }else{
            result(null,{status:"success",message:"Authentication Successful",uid:results[0]['uid']});
        }
    })
    
}



function _insertBMap(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO staff_business_mapping SET ?",[model],(err,res)=>{
            if(err){
                reject();
                console.log('Staff BMap Insert Failed due to '+err);
                return;
            }
            
            resolve(res.insertId);
        })
    })
}





function _getAllBusiness(userid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT B.name,B.description,A.status,A.bid FROM `staff_business_mapping` as A,`business_master` as B WHERE A.bid = B.bid AND A.staffid = ?;",[userid],(err,res)=>{
                if(err){
                    
                    console.log('Get All Merchants Failed due to '+err);
                    return;
                }
               
                resolve(res);
            })
    });
}



module.exports = StaffModel;