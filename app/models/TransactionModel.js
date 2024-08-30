const { json } = require('express');
const sql = require('./db.js');
const ContactInfo = require("./ContactInfoModel.js");

const TransactionModel = function(model){
   
   
    
    
}




TransactionModel.getDetails = (refID,result)=>{
    

    getData(refID).then((rows)=>{
        if(rows.length > 0){
           
            result(null,rows);
        }else{
            result(null,"");
        }
       
    }).catch((err)=>{
        result(err,"");
    })
    
   
}
TransactionModel.CreatePayment = (model,result)=>{
    

    CreatePayment(model).then((id)=>{
        result(null,{status:"success",message:"Payment Created Successfully",transactionId:id});
    }).catch((err)=>{
        result(err,{status:"failure",message:"Payment Create Failed"});
    })
    
   
}


function CreatePayment(model){
    
    return new Promise((resolve,reject)=>{
        var query = "INSERT INTO `payment_master` (`paymentid`, `paymenttype`, `totalamount`, `paid`, `pending`, `description`, `date`) VALUES (NULL, '"+model.paymenttype+"', '"+model.amount+"', '0', '0', '"+model.description+"', current_timestamp());";
        sql.query(query,(err,res)=>{
                if(err){
                    console.log('Create Payment Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Create Payment successfull');
                var orderid = res.insertId;
                sql.query("INSERT INTO `transaction_master` (`userid`,`bid`, `amount`, `transtype`, `orderid`, `paymentstatus`) VALUES (?,?,?,'payment',?,1 );",[model.userid,model.bid,model.amount,orderid],(err,res)=>{
                    if(err){
                        console.log('Transaction create Failed due to '+err);
                        reject(err);
                        return;
                    }
                    console.log('Transaction created successfully : '+res.insertId);
                    resolve(res.insertId);
                })
                
            })
    });
}





function getData(refId){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM transaction_master WHERE transactionid = ? LIMIT 1",[refId],(err,data)=>{
            if(err){
                console.log("Get Transaction Details Failed : "+err);
                reject(err);
                return;
            }
           console.log("Transaction Details Fetched Successfully");
           console.log(data[0])
           resolve(data);
    
           
            
        })
    })
}









module.exports = TransactionModel;