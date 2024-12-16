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




StaffModel.addUser = (phone,name,userid,result)=>{
   
    getUserByPhone(phone).then((data)=>{
        if(data.length == 0){
            addUser(phone,name,userid).then((id)=>{
                result(null,{status:"success",message:"User Created Successfully",uid:id});
            }).catch(()=>{
                result("err",{status:"failure",message:"User create Failed"});
            });
        }else{
            result("err",{status:"failure",message:"User already exists"});
        }
    }).catch(()=>{
        result("err",{status:"failure",message:"User create Failed"});
    });
    
    
    
}


StaffModel.getAllBusiness = (userid,result)=>{
   
    _getAllBusiness(userid).then((data)=>{
        result(null,{status:"success",message:"Merchant Data Fetched Successfully",data:data});
    }).catch(()=>{
        result(null,{status:"failure",message:"Merchant Data Fetch Failed"});
    });
 
}


StaffModel.UpdateBusinessStatus = (model,result)=>{
   
    _updateBusinessStatus(model).then(()=>{
        result(null,{status:"success",message:"BMap Data Updated Successfully"});
    }).catch(()=>{
        result(null,{status:"failure",message:"BMap Data Update Failed"});
    });
 
}


StaffModel.AddFollowUp = (userid,result)=>{
   
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



function addUser(phone,name,userid){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO user_master SET name = ? ,phone = ?,usertype = 1,createdby = ?",[name,phone,userid],(err,res)=>{
            if(err){
                reject();
                console.log('User Insert Failed due to '+err);
                return;
            }
            console.log('User Created successfully');
            resolve(res.insertId);
        })
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

function _updateBusinessStatus(model){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE staff_business_mapping SET status = ? WHERE bid = ? AND staffid = ?",[model.status,model.bid,model.staffid],(err,res)=>{
            if(err){
                reject();
                console.log('Staff BMap Update Failed due to '+err);
                return;
            }
            
            resolve();
        })
    })
}





function _getAllBusiness(userid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT B.name,B.description,A.status FROM `staff_business_mapping` as A,`business_master` as B WHERE A.bid = B.bid AND A.staffid = ?;",[userid],(err,res)=>{
                if(err){
                    
                    console.log('Get All Merchants Failed due to '+err);
                    return;
                }
               
                resolve(res);
            })
    });
}
function getUserByPhone(phone){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT uid, name,phone,active,usertype,DATE_FORMAT(lastlogin, '%d-%m-%Y %h:%i:%s %p') as lastlogin,DATE_FORMAT(createdon, '%d-%m-%Y %h:%i:%s %p') as registeredon FROM user_master WHERE phone = ?;",phone,(err,res)=>{
                if(err){
                    
                    console.log('Get Users Failed due to '+err);
                    return;
                }
                console.log('Get  User Fetched');
                resolve(res);
            })
    });
}




module.exports = StaffModel;