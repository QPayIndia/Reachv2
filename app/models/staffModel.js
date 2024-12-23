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


StaffModel.getHomeData = (userid,result)=>{
   
    _getAllBusiness(userid).then((data)=>{
        _getHomeData(userid).then((analytics)=>{
            result(null,{status:"success",message:"Merchant Data Fetched Successfully",data:data,analytics:analytics});
        }).catch(()=>{
            result(null,{status:"failure",message:"Merchant Data Fetch Failed"});
        });

       
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


StaffModel.GetExpense = (staffid,date,result)=>{
   
    _getExpense(staffid,date).then((data)=>{
        result(null,{status:"success",message:"Expenses Fetched Successfully",data:data});
    }).catch(()=>{
        result(null,{status:"failure",message:"Expenses Fetch Failed",data:[]});
    });
 
}


StaffModel.AddFollowUp = (model,followupid,result)=>{
   
   if(followupid === 0){
        _insertFollowUp(model).then((data)=>{
            result(null,{status:"success",message:"Follow Up Added Successfully",data:data});
        }).catch(()=>{
            result(null,{status:"failure",message:"Follow Up Add Failed"});
        });
   }else{
        _updateFollowup(model,followupid).then(()=>{
            _getFollowUps(model.staffid,model.appdate).then((data)=>{
                result(null,{status:"success",message:"Follow Up Updated Successfully",data:data});
            }).catch(()=>{
                result(null,{status:"failure",message:"Follow Up Fetch Failed"});
            });
            
        }).catch(()=>{
            result(null,{status:"failure",message:"Follow Up Update Failed"});
        });
   }
 
}

StaffModel.AddExpense = (model,expenseid,result)=>{
   
    if(expenseid === 0){
         _insertExpense(model).then((data)=>{
             result(null,{status:"success",message:"Expense Added Successfully",data:data});
         }).catch(()=>{
             result(null,{status:"failure",message:"Expense Add Failed"});
         });
    }else{
         _updateExpense(model,expenseid).then(()=>{
            result(null,{status:"success",message:"Expense Updated Successfully"});

         }).catch(()=>{
             result(null,{status:"failure",message:"Expense Update Failed"});
         });
    }
  
 }

StaffModel.GetFollowupDate = (staffid,date,result)=>{
   
    _getFollowUps(staffid,date).then((data)=>{
        result(null,{status:"success",message:"Follow Up Fetched Successfully",data:data});
    }).catch(()=>{
        result(null,{status:"failure",message:"Follow Up Fetch Failed"});
    });
 
}


StaffModel.InsertLocationLog = (model,result)=>{
   
    _insertLocationLog(model).then((data)=>{
        result(null,{status:"success",message:"Location Log Inserted Successfully",data:data});
    }).catch(()=>{
        result(null,{status:"failure",message:"Location Log Insert Failed"});
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


function _insertFollowUp(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO staff_follow_up_master SET ?",[model],(err,res)=>{
            if(err){
                reject();
                console.log('Staff Follow Up Insert Failed due to '+err);
                return;
            }
            
            resolve(res.insertId);
        })
    })
}


function _insertLocationLog(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO staff_location_log SET ?",[model],(err,res)=>{
            if(err){
                reject();
                console.log('Staff Location Insert Failed due to '+err);
                return;
            }
            
            resolve(res.insertId);
        })
    })
}



function _insertExpense(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO staff_expense_master SET ?",[model],(err,res)=>{
            if(err){
                reject();
                console.log('Staff Expense Insert Failed due to '+err);
                return;
            }
            
            resolve(res.insertId);
        })
    })
}

function _updateFollowup(model,followupid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE staff_follow_up_master SET status = ?,apptime = ?,remarks = ? WHERE followupid = ?",[model.status,model.apptime,model.remarks,followupid],(err,res)=>{
            if(err){
                reject();
                console.log('Staff Follow Up Insert Failed due to '+err);
                return;
            }
            
            resolve(res.insertId);
        })
    })
}

function _updateExpense(model,expenseid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE staff_expense_master SET status = ?,title = ?,amount = ?,bill =? WHERE expenseid = ?",[model.status,model.title,model.amount,model.bill,expenseid],(err,res)=>{
            if(err){
                reject();
                console.log('Staff Expense Update Failed due to '+err);
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
        sql.query("SELECT B.bid,B.name,B.description,A.status FROM `staff_business_mapping` as A,`business_master` as B WHERE A.bid = B.bid AND A.staffid = ?;",[userid],(err,res)=>{
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


function _getFollowUps(staffid,date){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT DATE_FORMAT(A.appdate, '%Y-%m-%d') as appdate,A.followupid,A.apptime,A.remarks,A.status,B.name,B.bid,C.name as ownername,C.phone as ownerphone FROM staff_follow_up_master as A,business_master as B,user_master as C WHERE A.staffid = ? AND A.appdate = ? AND A.bid = B.bid AND B.uid = C.uid;",[staffid,date],(err,res)=>{
                if(err){
                    
                    console.log('Get Followups Failed due to '+err);
                    return;
                }
                console.log('Get Followups Fetched');
                resolve(res);
            })
    });
}

function _getExpense(staffid,date){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT DATE_FORMAT(A.date, '%d-%m-%Y %h:%i:%s %p') as date,A.expenseid,A.title,A.amount,A.bill FROM staff_expense_master as A WHERE A.staffid = ? AND date > ? AND date < ?;",[staffid,date+" 00:00:00",date+" 23:59:59"],(err,res)=>{
                if(err){
                    
                    console.log('Get Expense Failed due to '+err);
                    return;
                }
                console.log('Get Expense Fetched');
                resolve(res);
            })
    });
}

function _getHomeData(staffid){
    return new Promise((resolve,reject)=>{

        //Getting the Start and End Date of a Month
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const formatDate = (date) => date.toISOString().split('T')[0];


        sql.query("SELECT COUNT(*) as attended,SUM(CASE WHEN status = 'ONBOARDING' THEN 1 ELSE 0 END) AS onboarded,SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) AS rejected,SUM(CASE WHEN status = 'INLIVE' THEN 1 ELSE 0 END) AS inlive FROM staff_business_mapping WHERE date > ? AND date < ?;",[staffid,formatDate(startOfMonth)+" 00:00:00",formatDate(endOfMonth)+" 23:59:59"],(err,res)=>{
                if(err){
                    
                    console.log('Get Home Data Failed due to '+err);
                    return;
                }
                
                resolve(res);
            })
    });
}




module.exports = StaffModel;