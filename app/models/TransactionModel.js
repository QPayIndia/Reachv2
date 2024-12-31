const { json } = require('express');
const sql = require('./db.js');
const ContactInfo = require("./ContactInfoModel.js");
const { pgCommission, payStatus } = require('../config/globals.js');
const axios = require('axios');
const BusinessMaster = require('./businessMasterModel.js');
const Socket = require('../utils/socket.js');
require('dotenv').config();

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
TransactionModel.UpdateTransactionResponse = (model,result)=>{
    

    _updateTransactionResponse(model).then((id)=>{
       if(model.ResponseCode == 200 || model.ResponseCode == 100){
        _getTXNDetails(model.MerchantOrderID).then((data)=>{
           if(data.transtype === "order")
            { 
               
                _getpostTransactionData(id).then((transData)=>{
                if(transData.length > 0){
                    if(transData[0]['transtype'] === 'order'){
                        if(transData[0]['carttype'] === 'service'){

                            _getUIDFromServiceOrder(transData[0]['orderid']).then((data)=>{
                               
                                if(data['uid']!= null)  Socket.SendMessageByUserId(data.uid,'order',{orderitemid:data.orderitemid,ordertype:"service",message:'Hurray! You got an order'},"","","");
                              
                          }
                           );

                            _updateServiceCartItems(transData[0]['orderid']).then(()=>{
                                result(null,{status:"success"});
                            }).catch((err)=>{
                                result(null,{status:"success"});
                            })
                        }else if (transData[0]['carttype'] === 'product'){

                            //Send Notification
                            
                            
                            _getUIDFromProductOrder(transData[0]['orderid']).then((data)=>{
                               
                                  if(data['uid']!= null)  Socket.SendMessageByUserId(data.uid,'order',{orderitemid:data.orderitemid,ordertype:"product",message:'Hurray! You got an order'},"","","");
                                
                            }
                             );


                            _updateCartProductItems(transData[0]['orderid']).then(()=>{
                                result(null,{status:"success"});
                            }).catch((err)=>{
                                result(null,{status:"success"});
                            })
                        }
                        else{
                            //add validation for carttype
                            result(null,{status:"success"});
                        }
                    }
                    else{
                        result(null,{status:"success"});
                    }
                }else{
                    result(err,{status:"failure"});
                }
            }).catch((err)=>{
            result(err,{status:"failure"});
        })
        }else if(data.transtype === 'bill'){
            //result(null,{status:"success",message:"asd",code:"sad"});
            _initBillPayment(model.MerchantOrderID,data.orderid).then((data)=>{
                result(null,{status:"success",message:data.message,code:data.code});
            }).catch((err)=>{
                result(null,{status:"success",message:data.message,code:data.code});
            })
        }
        }).catch((Err)=>{
            result(null,{status:"success"});
        })
       }else{
            result(null,{status:"success"});
       }
        
    }).catch((err)=>{
        result(err,{status:"failure"});
    })
    
   
}
TransactionModel.getPaymentDetails = (transactionid,result)=>{
    
    _getTXNDetails(transactionid).then((data)=>{
        if(data.transtype === 'bill'){
            _getBillPaymentDetails(transactionid).then((row)=>{
                result(null,{status:"success",message:"Payment Details Fetched Successfully",data:row});
            }).catch((err)=>{
                result(err,{status:"failure",message:"Payment Details Fetch Failed"});
            })
        }else if(data.transtype === 'order'){
            _getOrderPaymentDetails(transactionid).then((row)=>{
                result(null,{status:"success",message:"Payment Details Fetched Successfully",data:row});
            }).catch((err)=>{
                result(err,{status:"failure",message:"Payment Details Fetch Failed"});
            })
        }
        else{
            getPaymentDetails(transactionid).then((row)=>{
                result(null,{status:"success",message:"Payment Details Fetched Successfully",data:row});
            }).catch((err)=>{
                result(err,{status:"failure",message:"Payment Details Fetch Failed"});
            })
        }
           
        }).catch((err)=>{
        result(err,{status:"failure",message:"Payment Details Fetch Failed"});
    })
    
   
}


TransactionModel.InitBillPayment = (txnid,billid,result)=>{
    

    _initBillPayment(txnid,billid).then((data)=>{
        result(null,{status:"success",message:"Payment Details Fetched Successfully",data:data});
    }).catch((err)=>{
        result(err,{status:"failure",message:"Payment Details Fetch Failed"});
    })
    
   
}

TransactionModel.getTransactions = (uid,bid,type,result)=>{
    
    var data = [];
    let userid = (type === "user") ? uid : bid;

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

function _updateTransactionResponse(model){
    
    return new Promise((resolve,reject)=>{

        let status = 1;
        if(model.ResponseCode  === '100' || model.ResponseCode  === '200' ){
            status = 2;
        }else{
            status = 4;
        }
        console.log(model);
        
        sql.query("UPDATE `transaction_master` SET `paymentstatus` = ? , `bankrefno` = ?, `bankmessage` = ?, `bankresponse` = ? WHERE `transaction_master`.`transactionid` = ?;",[status,model.MSPReferenceID,model.Message,JSON.stringify(model),model.MerchantOrderID],(err,res)=>{
            if(err){
                console.log('Transaction Update After PG Response Failed due to '+err);
                reject(err);
                return;
            }
            console.log('Transaction Updated successfully Update After PG Response : '+model.MerchantOrderID);
            resolve(model.MerchantOrderID);
        })
    });
}


function _getpostTransactionData(refId){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.transactionid,A.transtype,B.carttype,A.orderid FROM transaction_master A LEFT JOIN order_master B ON A.orderid = B.orderid WHERE A.transactionid = ?;",[refId],(err,data)=>{
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
function _updateCartProductItems(orderid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE `product_order_items` SET `deliverystatus` = '1' WHERE `product_order_items`.`orderid` = ?;DELETE FROM product_cart_master WHERE orderid = ?;",[orderid,orderid],(err,data)=>{
            if(err){
                console.log("Product Cart Items Delete Failed : "+err);
                reject(err);
                return;
            }
           console.log("Product Cart Items Deleted Successfully");
           resolve();
    
           
            
        })
    })
}


function _updateServiceCartItems(orderid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE `service_order_items` SET `deliverystatus` = '1' WHERE `service_order_items`.`orderid` = ?;DELETE FROM service_cart_master WHERE orderid = ?;",[orderid,orderid],(err,data)=>{
            if(err){
                console.log("Service Cart Items Delete Failed : "+err);
                reject(err);
                return;
            }
           console.log("Service Cart Items Deleted Successfully");
           resolve();
    
           
            
        })
    })
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

function _getUIDFromProductOrder(orderid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT D.uid,B.orderitemid FROM `product_master`as A,`product_order_items` as B,`business_master` as D WHERE B.productid = A.productid AND A.uid = D.bid AND B.orderid = ?;",[orderid],(err,data)=>{
            if(err){
                
                reject(err);
                return;
            }
           resolve(data[0]);
    
           
            
        })
    })
}

function _getUIDFromServiceOrder(orderid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT D.uid,B.orderitemid FROM `service_master`as A,`service_order_items` as B,`business_master` as D WHERE B.serviceid = A.serviceid AND A.uid = D.bid AND B.orderid = ?;",[orderid],(err,data)=>{
            if(err){
                
                reject(err);
                return;
            }
           resolve(data[0]);
    
           
            
        })
    })
}

function getTransactions(userid,type,month){
    var query = "";
    if(type === "merchant")
    query = "SELECT A.amount,A.transactionid,A.paymentstatus as status,A.userid,A.bid,B.photo as profile,B.name,B.phone,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date FROM transaction_master as A,user_master as B WHERE A.bid = "+userid+" AND A.userid = B.uid AND DATE_FORMAT(A.createdon, '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL "+month+" MONTH, '%Y-%m') ORDER BY A.transactionid DESC;";
    else
    query = "SELECT A.amount,A.transactionid,A.paymentstatus as status,A.userid,A.bid,B.profile,B.name,C.phone,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date FROM transaction_master as A,business_info as B,contact_info as C WHERE A.userid = "+userid+" AND A.bid = B.uid AND B.uid = C.uid AND DATE_FORMAT(A.createdon, '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL "+month+" MONTH, '%Y-%m') ORDER BY A.transactionid DESC;";

    return new Promise((resolve,reject)=>{
        sql.query(query,(err,data)=>{
            if(err){
                console.log("Get Transaction List Failed : "+userid+" : "+type);
                console.log("Get Transaction List Failed : "+err);
                
                reject(err);
                return;
            }
           console.log("Transaction List Fetched Successfully - "+userid+" : "+type);
           if(data.length > 0){
            for (let i = 0; i < data.length; i++){
                data[i]['status'] = payStatus[ data[i]['status']];
            }
            }
           resolve(data);
    
           
            
        })
    })
}

 function _initBillPayment(txnid,billid){

    return new Promise((resolve,reject)=>{
        const query = "SELECT * FROM bill_transaction_master WHERE billid = "+billid+";"
        sql.query(query,async (err,data)=>{
            if(err){}
            
            if(data.length > 0){

                data = data[0];
                const sess = `${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

                let param1 = data.billnumber;
                let param2 = data.mobilenumber;
                let telecomCircle = data.telecomcircle;

                if(data.billtype === "CREDIT CARD"){
                    param1 = data.mobilenumber ;
                    param2 = data.billnumber ;
                }else if(data.billtype === "DTH"){
                    param1 = data.billnumber;
                    param2 = data.amount;
                }else if (data.billtype === "ELECTRICITY" || data.billtype === "FASTAG" || data.billtype === "POSTPAID" || data.billtype === "LOANEMI"){
                    telecomCircle = "TN";
                }

                 

                const sendData = {
                    billerId: data.billerid,
                    telecomCircle :telecomCircle,
                    externalRef: sess,
                    enquiryReferenceId: data.enquiryid,
                    inputParameters: {
                      param1: param1,
                      param2: param2
                      
                    },
                    initChannel: 'AGT',
                    deviceInfo: {
                      terminalId: '123456',
                      mobile: '9940620016',
                      postalCode: '638011',
                      geoCode: '11.3275,77.7033'
                    },
                    paymentMode: 'Cash',
                    paymentInfo: {
                      Remarks: 'CashPayment'
                    },
                    remarks: {
                      param1: '9940620016'
                    },
                    transactionAmount: data.amount,
                    customerPan : ""
                  };
                
                  _insertIPayLog(sess,sendData);
            
                try {
                    const response = await axios.post(
                      'https://api.instantpay.in/marketplace/utilityPayments/payment',
                      sendData,
                      {
                        headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json',
                          'X-Ipay-Auth-Code': '1',
                          "X-Ipay-Client-Id": process.env.INV_ID,
                          "X-Ipay-Client-Secret": process.env.INV_SECRET,
                          "X-Ipay-Outlet-Id": "192785",
                          'X-Ipay-Endpoint-Ip': '216.48.190.93'
                        }
                      }
                    );
                
                    // Handle response
                    const result = response.data;
                   
                    if(result.statuscode === "TXN"){
                       
                    }
                    if(result.statuscode === "TUP"){

                    }

                    resolve({code:result.statuscode,message:result.message});
                    _updateIPayLog(sess,result,result.ipay_uuid);

                    sql.query("UPDATE bill_transaction_master SET transactionid = ?,qpayrefid = ?,status = ?,ipayrefid = ? WHERE billid = ?",[txnid,sess,result.statuscode,result.ipay_uuid,billid],async (err,data)=>{
                    });
                    
                  } catch (error) {
                    console.error('Error making API request:', error.response?.data || error.message);
                    resolve({code:"ERR",message:"Unable To Process"});
                  }
                return;
            }else{
                resolve({code:"ERR",message:"Unable To Process"});
            }
        })
    
            
  
    })


    
}


function getPaymentDetails(transactionid){
   
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.amount,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date,paymentstatus as status ,B.name as businessname,D.phone as businessphone,C.name as username,C.phone as userphone  FROM `transaction_master`as A,`business_info` as B,`user_master` as C,`contact_info` as D WHERE A.bid = B.uid AND A.userid = C.uid AND A.bid = D.uid AND A.transactionid = ?;",[transactionid],(err,data)=>{
            if(err){
                console.log("Get Transaction Details Failed : "+err);
                reject(err);
                return;
            }
           console.log("Transaction Details Fetched Successfully");
           

           data[0]['type'] = "pay";
           if(data.length> 0){
            data[0]['status'] = payStatus[data[0]['status']]
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


function _getBillPaymentDetails(transactionid){
   
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.amount,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date,paymentstatus as status ,B.billername as businessname,B.billid as businessphone,C.name as username,C.phone as userphone  FROM `transaction_master`as A,`bill_transaction_master` as B,`user_master` as C WHERE A.orderid = B.billid AND A.userid = C.uid  AND A.transactionid = ?;",[transactionid],(err,data)=>{
            if(err){
                console.log("Get Transaction Details Failed : "+err);
                reject(err);
                return;
            }
           data[0]['type'] = "bill";
           

           if(data.length> 0){
            data[0]['status'] = payStatus[data[0]['status']]
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


function _getOrderPaymentDetails(transactionid){
   
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.amount,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date,paymentstatus as status ,C.name as username,C.phone as userphone  FROM `transaction_master`as A,`user_master` as C WHERE A.userid = C.uid  AND A.transactionid = ?;",[transactionid],(err,data)=>{
            if(err){
                console.log("Get Transaction Details Failed : "+err);
                reject(err);
                return;
            }
            data[0]['type'] = "order";
           data[0]['businessname'] = "";
           data[0]['businessphone'] = "";
           if(data.length> 0){
            data[0]['status'] = payStatus[data[0]['status']]
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

function _getTXNDetails(transactionid){
    
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM `transaction_master` WHERE transactionid = ?;",[transactionid],(err,data)=>{
            if(err){
                console.log("Get Transaction Details Failed : "+err);
                reject(err);
                return;
            }
          
           console.log(data[0]);

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


  function _insertIPayLog(sess,request){
    sql.query("INSERT INTO `instantpay_log` (`refid`, `request`) VALUES (? ,? );",[sess,JSON.stringify(request)],(err,res)=>{
        if(err){
            console.log(err);
            
            return;
        }
        
    })
}
function _updateIPayLog(sess,response,ipay_id){
    sql.query("UPDATE `instantpay_log` SET `response` = ?, ipayid = ? WHERE refid = ?;",[JSON.stringify(response),ipay_id,sess],(err,res)=>{
        if(err){
            console.log(err);
            
            return;
        }
        
    })
}










module.exports = TransactionModel;