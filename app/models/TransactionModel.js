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
TransactionModel.getPaymentDetails = (transactionid,result)=>{
    

    getPaymentDetails(transactionid).then((row)=>{
        result(null,{status:"success",message:"Payment Details Fetched Successfully",data:row});
    }).catch((err)=>{
        result(err,{status:"failure",message:"Payment Details Fetch Failed"});
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


function getPaymentDetails(transactionid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.amount,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date ,B.name as businessname,D.phone as businessphone,C.name as username,C.phone as userphone  FROM `transaction_master`as A,`business_info` as B,`user_master` as C,`contact_info` as D WHERE A.bid = B.uid AND A.userid = C.uid AND A.bid = D.uid AND A.transactionid = ?;",[transactionid],(err,data)=>{
            if(err){
                console.log("Get Transaction Details Failed : "+err);
                reject(err);
                return;
            }
           console.log("Transaction Details Fetched Successfully");

           data[0]['amountinwords'] = numberToWords(data[0]['amount']);
          
           resolve(data[0]);
    
           
            
        })
    })
}

function numberToWords(number) {
    const singleDigits = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tensDigits = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const scales = ["", "Thousand", "Lakh", "Crore"];
    
    function convertNumberToWords(num) {
        if (num === 0) return "";
        else if (num < 10) return singleDigits[num];
        else if (num < 20) return teens[num - 10];
        else if (num < 100) return tensDigits[Math.floor(num / 10)] + (num % 10 === 0 ? "" : " " + singleDigits[num % 10]);
        else if (num < 1000) return singleDigits[Math.floor(num / 100)] + " Hundred" + (num % 100 === 0 ? "" : " " + convertNumberToWords(num % 100));
        else {
            let scaleIndex = 0;
            let result = "";
            while (num > 0) {
                let remainder = num % 1000;
                if (remainder !== 0) {
                    const words = convertNumberToWords(remainder);
                    result = words + (scales[scaleIndex] ? " " + scales[scaleIndex] : "") + " " + result;
                }
                num = Math.floor(num / 1000);
                scaleIndex++;
            }
            return result.trim();
        }
    }
    
    function convertDecimalToWords(decimal) {
        const decimalPart = Math.round(decimal * 100);
        if (decimalPart === 0) return "";
        return " and " + convertNumberToWords(decimalPart) + " Paise";
    }

    const integerPart = Math.floor(number);
    const decimalPart = number % 1;

    return convertNumberToWords(integerPart) + " Rupees" + convertDecimalToWords(decimalPart);
}










module.exports = TransactionModel;