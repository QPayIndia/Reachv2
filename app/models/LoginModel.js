const { json } = require('express');
const sql = require('./db.js');
const ContactInfo = require("../models/ContactInfoModel.js");

const LoginModel = function(model){
   
    this.phone = model.phone,
    this.name = model.name,
    this.nameprefix = model.nameprefix
    
    
}




LoginModel.Login = (phone,result)=>{
    

    getData(phone).then((rows)=>{
        if(rows.length > 0){
            result(null,{status:"success",message:"Login Fetched Successfully",uid:rows[0]['uid']});
        }
        // else{
        //     login(phone).then((id)=>{
        //         result(null,{status:"success",message:"User Created Successfully",uid:id});
        //     }).catch((err)=>{
        //         result(null,{status:"failure",message:"Login Failed due to "+err});
        //     });
        // }
    })
    
   
}
LoginModel.Signup = (model,result)=>{
    

    getData(model.phone).then((rows)=>{
        if(rows.length > 0){
            result(null,{status:"success",message:"Login Fetched Successfully",uid:rows[0]['uid']});
        }else{
            login(model).then((id)=>{
                const binfo = new ContactInfo({
                    uid : id,
                    phone : model.phone,
                    name : model.name,
                    nameprefix : model.nameprefix,
                    createdby:id
                    });
                    
                    
                
                    ContactInfo.create(binfo,(err,data)=>{
                        if(err){
                            result(null,{status:"failure",message:"Something went wrong",uid:id});
                        }
                        else
                        result(null,{status:"success",message:"User Created Successfully",uid:id});
                    });
                
                
            }).catch((err)=>{
                result(null,{status:"failure",message:"Login Failed due to "+err});
            });
        }
    })
    
   
}

function login(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO user_master SET name = ?,phone = ?",[model.name,model.phone],(err,res)=>{
                if(err){
                    reject(err);
                    console.log('Login Failed due to '+err);
                    return;
                }
                console.log('Login successfully');
                resolve(res.insertId);
            })
    });
}



function getData(phone){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM user_master WHERE phone = ? LIMIT 1",[phone],(err,data)=>{
            if(err){
                result(err,{status:"failure",message:err,data:{}});
                
                return;
            }
           
           resolve(data);
    
           
            
        })
    })
}

LoginModel.getData = (phone,result)=>{
  
    sql.query("SELECT * FROM user_master WHERE phone = ? LIMIT 1",[phone],(err,data)=>{
        if(err){
            result(err,{status:"failure",message:err,data:{}});
            
            return;
        }
       
       res

       
        
    })

    
}









module.exports = LoginModel;