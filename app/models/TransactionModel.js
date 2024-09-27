const { json } = require('express');
const sql = require('./db.js');
const ContactInfo = require("./ContactInfoModel.js");
const { pgCommission } = require('../config/globals.js');

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

TransactionModel.getTransactions = (userid,type,result)=>{
    
    var data = [];

    getTransactions(userid,type,0).then((month1)=>{
        data[0]={name:getPreviousMonthAndYear(0),transactions:month1}
        getTransactions(userid,type,1).then((month2)=>{
            data[1]={name:getPreviousMonthAndYear(1),transactions:month2}
            getTransactions(userid,type,2).then((month3)=>{
                data[2]={name:getPreviousMonthAndYear(2),transactions:month3}
                result(null,{status:"success",message:"Transaction List Fetched Successfully",data:data});
            }).catch((err)=>{
                result(err,{status:"failure",message:"Transaction List Fetch Failed"});
            })
        }).catch((err)=>{
            result(err,{status:"failure",message:"Transaction List Fetch Failed"});
        })
    }).catch((err)=>{
        result(err,{status:"failure",message:"Transaction List Fetch Failed"});
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
                sql.query("INSERT INTO `transaction_master` (`userid`,`bid`, `amount`, `transtype`, `orderid`, `paymentstatus`,`commissionpercentage`,`commissionamount`,`settlementamount`) VALUES (?,?,?,'payment',?,1,?,?,? );",[model.userid,model.bid,model.amount,orderid,pgCommission,model.amount * pgCommission/100,model.amount - (model.amount * pgCommission/100) ],(err,res)=>{
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
function getTransactions(userid,type,month){
    var query = "";
    if(type === "merchant")
    query = "SELECT A.amount,A.transactionid,A.userid,A.bid,B.photo as profile,B.name,B.phone,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date FROM transaction_master as A,user_master as B WHERE A.bid = "+userid+" AND A.userid = B.uid AND DATE_FORMAT(A.createdon, '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL "+month+" MONTH, '%Y-%m');";
    else
    query = "SELECT A.amount,A.transactionid,A.userid,A.bid,B.profile,B.name,C.phone,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date FROM transaction_master as A,business_info as B,contact_info as C WHERE A.userid = "+userid+" AND A.bid = B.uid AND B.uid = C.uid AND DATE_FORMAT(A.createdon, '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL "+month+" MONTH, '%Y-%m');";

    return new Promise((resolve,reject)=>{
        sql.query(query,(err,data)=>{
            if(err){
                console.log("Get Transaction List Failed : "+userid+" : "+type);
                console.log("Get Transaction List Failed : "+err);
                
                reject(err);
                return;
            }
           console.log("Transaction List Fetched Successfully - "+userid+" : "+type);
         
           resolve(data);
    
           
            
        })
    })
}


function getPaymentDetails(transactionid){
    console.log(transactionid);
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.amount,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date ,B.name as businessname,D.phone as businessphone,C.name as username,C.phone as userphone  FROM `transaction_master`as A,`business_info` as B,`user_master` as C,`contact_info` as D WHERE A.bid = B.uid AND A.userid = C.uid AND A.bid = D.uid AND A.transactionid = ?;",[transactionid],(err,data)=>{
            if(err){
                console.log("Get Transaction Details Failed : "+err);
                reject(err);
                return;
            }
           console.log("Transaction Details Fetched Successfully");
           console.log(data[0]);

           if(data.length> 0){
            if(data[0]['amount'] != null){
                data[0]['amountinwords'] = numberToWords(data[0]['amount']);
               }else{
                data[0]['amountinwords'] = "Rs. "+data[0]['amount'];
               }
           }
          
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

const getPreviousMonthAndYear = (month) => {
    // Array of month names
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Get the current date
    const now = new Date();
  
    // Subtract one month from the current date
    now.setMonth(now.getMonth() - month);
  
    // Get the previous month and year
    const previousMonth = now.getMonth(); // getMonth() is zero-based
    const previousYear = now.getFullYear();
  
    // Format the month and year
    const formattedMonthAndYear = `${monthNames[previousMonth]} ${previousYear}`;
  
    return formattedMonthAndYear;
  };










module.exports = TransactionModel;