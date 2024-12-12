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



StaffModel.getAllMerchants = (uid,result)=>{
   
    getAllMerchants().then((data)=>{
        result(null,{status:"success",message:"Merchant Data Fetched Successfully",data:data});
    }).catch(()=>{
        result(null,{status:"failure",message:"Merchants Data Fetch Failed"});
    });
    
    
    
}
StaffModel.getPendingMerchants = (uid,result)=>{
   
    getPendingMerchants().then((data)=>{
        result(null,{status:"success",message:"Merchant Data Fetched Successfully",data:data});
    }).catch(()=>{
        result(null,{status:"failure",message:"Merchants Data Fetch Failed"});
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
StaffModel.updateMerchantActiveStatus = (uid,result)=>{
   
    updateMerchantActiveStatus(uid).then(()=>{
        getMerchantActiveStatus(uid).then((data)=>{
            result(null,{status:"success",message:"Merchant Data Fetched Successfully",active:data['active']});
        }).catch((err)=>{
            result(null,{status:"failure",message:"Merchant Data Fetch Failed"});
        })
        
    }).catch(()=>{
        result(null,{status:"failure",message:"Merchants Data Fetch Failed"});
    });
    
    
    
}

StaffModel.getAllBusiness = (userid,result)=>{
   
    _getAllBusiness(userid).then((data)=>{
        result(null,{status:"success",message:"Merchant Data Fetched Successfully",data:data});
    }).catch(()=>{
        result(null,{status:"failure",message:"Merchant Data Fetch Failed"});
    });
 
}

StaffModel.deleteBusiness = (bid,result)=>{
   
    getBusinessByID(bid).then((data)=>{
       if(data.length > 0){
        deleteBusiness(bid).then(()=>{
            result(null,{status:"success",message:"Business Deleted Successfully"});
        }).catch(()=>{
            result(null,{status:"failure",message:"Business Delete Failed"});
        });
       }else{
        result(null,{status:"failure",message:"No Business Found"});
       }
    }).catch(()=>{
        result(null,{status:"failure",message:"Business Delete Failed"});
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

StaffModel.getHomeBanner = (userid,result)=>{
    getHomeBanner().then((data)=>{
        result(null,{status:"success",message:"Data Fetched Successfully",data:data});
    }).catch((err)=>{
        result(err,{status:"failure",message:"Data Fetch Failed"});
    });
    
}



StaffModel.updateBannerStatus = (bannerid,result)=>{
   
    updateBannerStatus(bannerid).then(()=>{
        getBannerStatus(bannerid).then((data)=>{
           result(null,{status:"success",message:"Banner Updated Successfully",active:data['active']});
        }).catch((err)=>{
            result(err,{status:"failure",message:"Banner Update Failed"});
        })
        
    }).catch((err)=>{
        result(err,{status:"failure",message:"Banner Update  Failed"});
    });
    
    
    
}


StaffModel.addBanner = (title,url,userid,result)=>{
   
    addBanner(title,url,userid).then((id)=>{
        result(null,{status:"success",message:"Banner Created Successfully",uid:id});
    }).catch((err)=>{
        result(err,{status:"failure",message:"Banner create Failed"});
    });
    
    
    
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




function getAllMerchants(){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.bid as uid, A.name,B.name as owner,B.phone,C.area,A.active,DATE_FORMAT(A.cretaedon, '%d-%m-%Y %h:%i:%s %p') as registeredon FROM business_master as A,contact_info as B,location_master as C WHERE A.bid = B.uid AND A.bid = C.uid;",(err,res)=>{
                if(err){
                    
                    console.log('Get All Merchants Failed due to '+err);
                    return;
                }
                console.log('Get All Merchants Fetched');
                resolve(res);
            })
    });
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
function getPendingMerchants(){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.bid as uid, A.name,B.name as owner,B.phone,C.area,A.active,DATE_FORMAT(A.cretaedon, '%d-%m-%Y %h:%i:%s %p') as registeredon FROM business_master as A,contact_info as B,location_master as C,business_info as D,kyc_master as E,business_kyc as F,payment_info_master as G WHERE A.bid = B.uid AND A.bid = C.uid AND A.uid = D.uid AND A.uid = E.uid AND A.uid = F.uid AND A.uid = G.uid AND A.active = 0;",(err,res)=>{
                if(err){
                    
                    console.log('Get Pending Merchants Failed due to '+err);
                    return;
                }
                console.log('Get Pending Merchants Fetched');
                resolve(res);
            })
    });
}


function updateMerchantActiveStatus(bid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE business_master SET active = CASE WHEN active = 0 THEN 1 WHEN active = 1 THEN 0 ELSE 0 END WHERE bid = ?;",bid,(err,res)=>{
                if(err){
                    
                    console.log('Status Update Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Status Updated Successfully for bid ' + bid);
                resolve();
            })
    });
}
function getMerchantActiveStatus(bid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT active FROM business_master WHERE bid = ?;",bid,(err,res)=>{
                if(err){
                    
                    console.log('Status Fetch Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Status Fetched Successfully for bid ' + bid);
                resolve(res[0]);
            })
    });
}



function deleteBusiness(bid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM business_master WHERE bid = ?",[bid],(err,data)=>{
            if(err){
                reject(err);
                console.log("Delete Business Failed " +err);
                return;
            }
    
    
            resolve();
        })
    })
}
function getBusinessByID(bid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM business_master WHERE bid = ?",[bid],(err,data)=>{
            if(err){
                reject(err);
                console.log(" Business Fetch Failed " +err);
                return;
            }
    
    
            resolve(data);
        })
    })
}

function getHomeBanner(){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT bannerid,title,url,active,DATE_FORMAT(createdon, '%d-%m-%Y %h:%i:%s %p') as date FROM home_banner_master ",(err,data)=>{
            if(err){
                reject(err);
                console.log(" Business Fetch Failed " +err);
                return;
            }
            resolve(data);
        })
    })
}

function updateBannerStatus(bannerid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE home_banner_master SET active = CASE WHEN active = 0 THEN 1 WHEN active = 1 THEN 0 ELSE 0 END WHERE bannerid = ?;",bannerid,(err,res)=>{
                if(err){
                    
                    console.log('Status Update Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Status Updated Successfully for bid ' + bannerid);
                resolve();
            })
    });
}

function getBannerStatus(bannerid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT active FROM home_banner_master WHERE bannerid = ?;",bannerid,(err,res)=>{
                if(err){
                    
                    console.log('Status Fetch Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Status Fetched Successfully for bid ' + bannerid);
                resolve(res[0]);
            })
    });
}

function addBanner(title,url,userid){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO home_banner_master SET title = ? ,url = ?,active = 1,createdby = ?",[title,url,userid],(err,res)=>{
            if(err){
                reject();
                console.log('Banner Insert Failed due to '+err);
                return;
            }
            console.log('Banner Inserted successfully');
            resolve(res.insertId);
        })
    })
}



module.exports = StaffModel;