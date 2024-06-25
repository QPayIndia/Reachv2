const { json } = require('express');
const sql = require('./db.js');

const PaymentModel = function(model){
    this.uid = model.uid,
    // this.pinfoid  = model.pinfoid,
    this.C=model.C,
    this.D=model.D,
    this.N=model.N,
    this.U=model.U,
    this.W=model.W,
    this.Cs=model.Cs,
    this.acno=model.acno,
    this.bname=model.bname,
    this.bbranch=model.bbranch,
    this.bifsc=model.bifsc,
    this.bcheque=model.bcheque,
    this.createdby = model.uid
    // this.createdon = model.createdon
}



PaymentModel.create = (model,result)=>{
   
    getData(model.uid).then((data)=>{
        if(data.length > 0){
            console.log("Info Already present")
            updatePaymentInfo(model).then((id)=>{
                result(null,{status:"success",message:"Payment Info Inserted Successfully",data:id});
            }).catch(({
        
            }));
        }else{
            addPaymentInfo(model).then((id)=>{
                result(null,{status:"success",message:"Payment Info Inserted Successfully",data:id});
            }).catch(({
        
            }));
        }
    })
    
    
    
}

function addPaymentInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO payment_info_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Payment Info Failed due to '+err);
                    return;
                }
                console.log('Payment Info Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function updatePaymentInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE payment_info_master SET ? WHERE uid = ?",[model,model.uid],(err,res)=>{
                if(err){
                    
                    console.log('Payment Info Failed due to '+err);
                    return;
                }
                console.log('Payment Info Updated successfully');
                resolve(res.insertId);
            })
    });
}



PaymentModel.getPaymentData = (uid,result)=>{
    
    getData(uid).then((data)=>{
        result(null,{status:"success",message:"Payment Info Fetched Successfully",data:data[0]});
    })

    
}

function getData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM payment_info_master WHERE uid = ? LIMIT 1",[uid],(err,data)=>{
            if(err){
                result(err,{status:"failure",message:err,data:{}});
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}



module.exports = PaymentModel;