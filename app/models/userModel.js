const sql = require('./db.js');
const axios = require('axios');


const User = function(model){
    // this.userid = model.userid,
    this.name = model.name,
    this.lastname = model.lastname,
    this.email = model.email,
    this.phone = model.phone,
    this.photo = model.photo,
    this.occupation = model.occupation,
    this.dob = model.dob
    
}

User.login = (model,result)=>{
    sql.query("SELECT COUNT(*) as count,username,password,userid FROM users WHERE username = ?",[model.username],(err,results)=>{
        if(err){
            
            console.log('Cannot find Player due to '+err);
            return;
        }
        if(results[0]['password'] == "" || results[0]['password'] == null){
            result(null,{status:"failure",message:"User doesn't exist"});
        }
        else if(results[0]['password'] != model.password){
            result(null,{status:"failure",message:"Password doen't match"});
        }else{
            result(null,{status:"success",message:"Authentication Successful",data:{id:results[0]['userid']}});
        }
    })
    
}

User.addUser = (model,uid,result)=>{
   
    getUserByPhone(model.phone).then((data)=>{
        if(data.length == 0 && uid == 0){
            addUser(model).then((id)=>{
                result(null,{status:"success",message:"User Created Successfully",uid:id});
            }).catch(()=>{
                result(null,{status:"failure",message:"User create Failed"});
            });
        }else{
           if(uid > 0){
                if(data[0]['phone'] == model.phone){
                    updateUser(model,uid).then(()=>{
                        result(null,{status:"success",message:"User Updated Successfully",uid:uid});
                    }).catch(()=>{
                        result(null,{status:"failure",message:"User Update Failed"});
                    });
                }else{
                    result(null,{status:"failure",message:"User Records doesn't Match"});
                }
           }else{
            result(null,{status:"failure",message:"User Update Failed"});
           }
        }
    }).catch(()=>{
        result(null,{status:"failure",message:"User create Failed"});
    });
    
    
    
}


User.getUserById = (uid,result)=>{
   
    getUserById(uid).then((data)=>{
        if(data.length >0){
            result(null,{status:"success",message:"User Fetched Successfully",data:data[0]});
        }else{
            result(null,{status:"failure",message:"User does not Exist"});
        }
    }).catch(()=>{
        result(null,{status:"failure",message:"User Fetch Failed"});
    });
    
    
    
}
User.sendOTP = (phone,uid,result)=>{
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(phone);
    
    InsertOTP(uid,otp).then((id)=>{
        SendOtpToMobile(phone,otp).then((id)=>{
            result(null,{status:"success",message:"OTP Send Successfully",otp:otp});
        }).catch((err)=>{
            result('',{status:"failure",message:"OTP Send Failed"});
        }); 
        // result(null,{status:"success",message:"OTP Send Successfully",otp:otp});
    }).catch((err)=>{
        result(err,{status:"failure",message:"OTP Send Failed"});
    }); 
}
User.verifyOTP = (phone,otp,result)=>{
    
    getOTP(phone).then((data)=>{
        if(data.length > 0){
        const currentTime = new Date();
        const dbTime = new Date(data[0]['timestamp']);
        const timeDifference = (currentTime - dbTime) / (1000 * 60);
        
        
        if(data[0]['otp'] === otp){
            result(null,{status:"success",message:"OTP Verified Successfully",uid:data[0]['userid']});
        }else if (data[0]['otp'] === otp && timeDifference >= 15){
            result(null,{status:"failure",message:"OTP Expired"});
        }else{
            result(null,{status:"failure",message:"Incorrect OTP"});
        }
        }else{
            result("",{status:"failure",message:"No OTP"});
        }
    }).catch((err)=>{
        result(err,{status:"failure",message:"OTP Send Failed"});
    }); 
}


User.updateName = (name,lastname,uid,result)=>{
   
    updateName(name,lastname,uid).then(()=>{
        result(null,{status:"success",message:"User Updated Successfully",uid:uid});
    }).catch(()=>{
        result(null,{status:"failure",message:"User Fetch Failed"});
    });
    
}
User.updateEmail = (email,uid,result)=>{
   
    updateEmail(email,uid).then(()=>{
        result(null,{status:"success",message:"User Updated Successfully",uid:uid});
    }).catch(()=>{
        result(null,{status:"failure",message:"User Fetch Failed"});
    });
    
}
User.updateDOB = (dob,uid,result)=>{
   
    updateDOB(dob,uid).then(()=>{
        result(null,{status:"success",message:"User Updated Successfully",uid:uid});
    }).catch(()=>{
        result(null,{status:"failure",message:"User Fetch Failed"});
    });
    
}

function addUser(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO user_master SET ?",[model],(err,res)=>{
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
function SendOtpToMobile(phone,otp){
    return new Promise((resolve,reject)=>{
        axios.post('http://pg.qpayindia.com/sms/sendsms.php', {
            phone:phone,
            otp:otp
          })
          .then(response => {
            console.log('Otp Sent to Mobile:', response.data);
            resolve();
          })
          .catch(error => {
            console.error('Otp Sent Failed :', error);
            reject();
          });
    })
}

function InsertOTP(userid,otp){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO otp_master SET userid = ?, otp = ?;",[userid,otp],(err,res)=>{
            if(err){
                reject(err);
                console.log('Otp Insert Failed due to '+err);
                return;
            }
            console.log('OTP Inserted successfully');
            resolve(res.insertId);
        })
    })
}
function getOTP(phone){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.otp,A.timestamp,A.userid FROM otp_master as A,user_master as B WHERE A.userid = B.uid AND B.phone = ? ORDER BY A.otpid DESC LIMIT 1;",[phone],(err,res)=>{
            if(err){
                reject(err);
                console.log('Otp Fetch Failed due to '+err);
                return;
            }
            console.log('OTP Fetch successfully');
            resolve(res);
        })
    })
}
function updateUser(model,uid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE user_master SET ? WHERE uid = ?",[model,uid],(err,res)=>{
            if(err){
                reject();
                console.log('User Update Failed due to '+err);
                return;
            }
            console.log('User Updated successfully');
            resolve();
        })
    })
}

function getUserByPhone(phone){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM user_master WHERE phone = ?;",phone,(err,res)=>{
                if(err){
                    
                    console.log('Get Users Failed due to '+err);
                    return;
                }
                console.log('Get  User Fetched');
                resolve(res);
            })
    });
}

function getUserById(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT uid,name,lastname,phone,email,photo,occupation,DATE_FORMAT(dob, '%Y-%m-%d %H:%i:%s') AS dob FROM user_master WHERE uid = ?;",uid,(err,res)=>{
                if(err){
                    
                    console.log('Get Users Failed due to '+err);
                    return;
                }
                console.log('Get  User Fetched');
               
                resolve(res);
            })
    });
}

function updateName(name,lastname,uid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE user_master SET name = ?,lastname = ? WHERE uid = ?",[name,lastname,uid],(err,res)=>{
            if(err){
                reject();
                console.log('User Update Failed due to '+err);
                return;
            }
            console.log('User Updated successfully');
            resolve();
        })
    })
}

function updateEmail(email,uid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE user_master SET email = ? WHERE uid = ?",[email,uid],(err,res)=>{
            if(err){
                reject();
                console.log('User Update Failed due to '+err);
                return;
            }
            console.log('User Updated successfully');
            resolve();
        })
    })
}


function updateDOB(dob,uid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE user_master SET dob = ? WHERE uid = ?",[dob,uid],(err,res)=>{
            if(err){
                reject();
                console.log('User Update Failed due to '+err);
                return;
            }
            console.log('User Updated successfully');
            resolve();
        })
    })
}





module.exports = User;