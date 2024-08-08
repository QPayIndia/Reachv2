const sql = require('./db.js');

const User = function(model){
    // this.userid = model.userid,
    this.name = model.name,
    this.lastname = model.lastname,
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
            result(null,{status:"success",message:"User Fetched Successfully",data:data});
        }else{
            result(null,{status:"failure",message:"User does not Exist"});
        }
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
        sql.query("SELECT * FROM user_master WHERE uid = ?;",uid,(err,res)=>{
                if(err){
                    
                    console.log('Get Users Failed due to '+err);
                    return;
                }
                console.log('Get  User Fetched');
                resolve(res);
            })
    });
}





module.exports = User;