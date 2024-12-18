
const sql = require('./db.js');
require('dotenv').config();
const axios = require('axios');
const { log } = require('console');
const global = require('../config/globals.js');
const crypto = require('crypto');


const BillPayments = function(model){

}

BillPayments.getPrepaidPlans = (userid,billerid,circle,result)=>{
   
    _getPrepaidPlans(billerid,circle).then((data)=>{
        result(null,{status:"success",message:"Prepaid Plans Fetched Successfully",data:data});
    }).catch((err)=>{
        result(err,{status:"failure",message:"Prepaid Plans Fetch Failed",data:[]});
    });
    
    
}
BillPayments.getCheckoutTotal = (amount,result)=>{

    let convenienceFee = (amount * global.billPayCommission/100).toFixed(2);
    result(null,{status:"success",message:"Convenience Fee Fetched Successfully",data:{amount:amount,convenienceFee:convenienceFee,total:amount+parseFloat(convenienceFee)}});
}


BillPayments.PayCreditCard = (cardnumber,result)=>{

    _payCreditCard(cardnumber).then((data)=>{
        result(null,{status:"success",message:"Bill Details Fetched Successfully",data:data});
    }).catch((err)=>{
        result(err,{status:"failure",message:err.status,data:err});
    });
}


BillPayments.getBillDetails = (operator,billnumber,mobilenumber,result)=>{
   
    _getBillDetails(operator,billnumber,mobilenumber).then((data)=>{
        result(null,{status:"success",message:"Bill Details Fetched Successfully",data:data});
    }).catch((err)=>{
        result(err,{status:"failure",message:err.status,data:err});
    });
    
    
}

BillPayments.initTransaction = (model,result)=>{


    let convenienceFee = (model.billamount * global.billPayCommission/100).toFixed(2);
    console.log(parseFloat(convenienceFee)+model.billamount);
    console.log(model.amount);
    
    if(parseFloat(convenienceFee)+model.billamount != model.amount) return result("",{status:"failure",message:"Invalid Data",transactionId:0});
   
    _initTransaction(model).then((id)=>{
        result(null,{status:"success",message:"Transaction Created",transactionId:id});
    }).catch((err)=>{
        result(err,{status:"failure",message:"Transaction Failed",transactionId:0});
    });
    
    
}

BillPayments.getOperators = (type,result)=>{
   
    _getOperators(type).then((data)=>{
        result(null,{status:"success",message:"Bill Details Fetched Successfully",data:data});
    }).catch((err)=>{
        result(err,{status:"failure",message:"Unable to fetch operators",data:[]});
    });
    
    
}

BillPayments.validateCard = (bin,result)=>{
   
    _validateCard(bin).then((data)=>{
        result(null,{status:"success",message:"Card Validated Successfully",data:data});
    }).catch((err)=>{
        result(err,{status:"failure",message:"Invalid Card",data:{}});
    });
    
    
}

BillPayments.getLoanProviders = (page,result)=>{
   
    _getLoanProviders(page).then((data)=>{
        result(null,{status:"success",message:"Loan Providers Fetched Successfully",data:data});
    }).catch((err)=>{
        result(err,{status:"failure",message:"Unable to fetch Loan Providers",data:[]});
    });
    
    
}

BillPayments.getCreditCardProviders = (page,result)=>{
   
    _getCreditCardProviders(page).then((data)=>{
        result(null,{status:"success",message:"Loan Providers Fetched Successfully",data:data});
    }).catch((err)=>{
        result(err,{status:"failure",message:"Unable to fetch Loan Providers",data:[]});
    });
    
    
}

function _getPrepaidPlans(billerid,circle){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT jsonPlan FROM `instantpay_recharge_plans` WHERE billerid = ? AND circle = ?",[billerid,circle],(err,data)=>{
            if(err){
                reject(err);
                console.log(err);
                
                return;
            }

           
            let parsedData = [];

            if(data.length > 0){
                try{
                    let rawData = JSON.parse(data[0]['jsonPlan'])['data']['plans'];
                    for(let i=0; i< rawData.length ; i++){
                        let model = {};
                        model['planid'] = rawData[i]['_id'];
                        model['amount'] = rawData[i]['planAmount'];
                        model['validity'] = rawData[i]['planValidity'];
                        model['description'] = rawData[i]['planDescription'];
                       
                        parsedData[i] = model;
                    }
                }catch(err){
                    console.log(err);
                    
                }
                
            }
            
            
            
    
            resolve(parsedData);
        })
    })
}

function _getOperators(type){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT biller_id,biller_name FROM `instantpay_billers` WHERE type = ? ",[type],(err,data)=>{
            if(err){
                reject(err);
                console.log(err);
                
                return;
            }

           
            
    
            resolve(data);
        })
    })
}

function _getBillDetails(operator,customerId,mobilenumber){
    return new Promise(async (resolve,reject)=>{
        const sess = `${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

        
        const request = {
            billerId: operator,
            initChannel: "AGT",
            externalRef: sess,
            inputParameters: {
                param1: customerId,
                param2: mobilenumber
            },
            deviceInfo: {
                mac: "02-00-AC-10-7A-99",
                ip: "164.52.211.128"
            },
            remarks: {
                param1: "9940620016"
            },
            transactionAmount: 10
        };


        _insertIPayLog(sess,request);

        const response = await axios.post(
            "https://api.instantpay.in/marketplace/utilityPayments/prePaymentEnquiry",
            request,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-Ipay-Auth-Code": "1",
                    "X-Ipay-Client-Id": process.env.INV_ID,
                    "X-Ipay-Client-Secret": process.env.INV_SECRET,
                    "X-Ipay-Outlet-Id": "192785",
                    "X-Ipay-Endpoint-Ip": "216.48.190.93"
                },
                httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }) // Disable SSL verification
            }
        );

        const result = response.data;
       
        
        
        

        let data = {}
                data.ipay_id = "";
                data.billamount = "";
                data.billduedate = "";
                data.customername = "";
                data.additionalinfo = "";
                data.status = "Unable to fetch bill";

        if (result) {
            _updateIPayLog(sess,result,result.ipay_uuid);
            data.status = result.status;
            if (
                result.statuscode === "TXN" &&
                result.status === "Transaction Successful"
            ) {
                let data = {}
                data.ipay_id = result.data.enquiryReferenceId;
                data.billamount = result.data.BillAmount;
                data.billduedate = result.data.BillDueDate;
                data.customername = result.data.CustomerName;
                data.additionalinfo = result.data.AdditionalDetails;
                
                resolve(data);
            }else
            reject(data)
        } else {
            reject(data);
        }
    });

    

}

function _getLoanProviders(page){
    return new Promise(async (resolve,reject)=>{
        const sess = `${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

        // Prepare the HTTP request
        const response = await axios.post(
            "https://api.instantpay.in/marketplace/utilityPayments/billers",
            {
                pagination : {
                    pageNumber : page,
                    recordsPerPage : 100
                },
                filters:{
                    categoryKey : "C13",
                    updatedAfterDate : ""
                }
            },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-Ipay-Auth-Code": "1",
                    "X-Ipay-Client-Id": process.env.INV_ID,
                    "X-Ipay-Client-Secret": process.env.INV_SECRET,
                    "X-Ipay-Outlet-Id": "192785",
                    "X-Ipay-Endpoint-Ip": "216.48.190.93"
                },
                httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }) // Disable SSL verification
            }
        );

        const result = response.data;

        // Process response

        let data = [];
        let meta = {};
        if(result.statuscode == "TXN"){
            meta.totalPages = result.data.meta.totalPages;
            meta.currentPage = result.data.meta.currentPage;
           
            
            
            for( let i= 0 ; i < result.data.records.length ; i++){
                let temp = {};
                temp.billerid = result.data.records[i].billerId;
                temp.billername = result.data.records[i].billerName;
                temp.icon = result.data.records[i].iconUrl;
                data[i] = temp;
            } 
            resolve({meta:meta,records:data});  
        }else{
            reject([])
        }
        
        
    });

    

}

function _getCreditCardProviders(page){
    return new Promise(async (resolve,reject)=>{
        const sess = `${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

        // Prepare the HTTP request
        const response = await axios.post(
            "https://api.instantpay.in/marketplace/utilityPayments/billers",
            {
                pagination : {
                    pageNumber : page,
                    recordsPerPage : 100
                },
                filters:{
                    categoryKey : "C15",
                    updatedAfterDate : ""
                }
            },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-Ipay-Auth-Code": "1",
                    "X-Ipay-Client-Id": process.env.INV_ID,
                    "X-Ipay-Client-Secret": process.env.INV_SECRET,
                    "X-Ipay-Outlet-Id": "192785",
                    "X-Ipay-Endpoint-Ip": "216.48.190.93"
                },
                httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }) // Disable SSL verification
            }
        );

        const result = response.data;

        // Process response

        let data = [];
        let meta = {};
        if(result.statuscode == "TXN"){
            meta.totalPages = result.data.meta.totalPages;
            meta.currentPage = result.data.meta.currentPage;
            // console.log(result.data.records);
            for( let i= 0 ; i < result.data.records.length ; i++){
                let temp = {};
                temp.billerid = result.data.records[i].billerId;
                temp.billername = result.data.records[i].billerName;
                temp.icon = result.data.records[i].iconUrl;
                data[i] = temp;
            } 
            resolve({meta:meta,records:data});  
        }else{
            reject([])
        }
        
        
    });

    

}


function _payCreditCard(cardnumber){
    return new Promise(async (resolve,reject)=>{
        const sess = `${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

        // Prepare the HTTP request
        const response = await axios.post(
            "https://api.instantpay.in/payments/payout",
            {
                payer: {
                    bankId: "0",
                    bankProfileId: "0",
                    accountNumber: " 9940620016",
                    name: "",
                    paymentMode: "",
                    cardNumber: "",
                    cardSecurityCode: "",
                    cardExpiry: {
                        month: "",
                        year: ""
                    },
                    referenceNumber: ""
                },
                payee: {
                    accountNumber: _aesEncryption(""),
                    name: "Thirugnanasambantham N"
                },
                transferMode: "CREDITCARD",
                transferAmount: "10.00",
                externalRef: sess,
                latitude: "20.5936",
                longitude: "78.9628",
                remarks: "Credit Card BILL",
                alertEmail: ""
            },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-Ipay-Auth-Code": "1",
                    "X-Ipay-Client-Id": process.env.INV_ID,
                    "X-Ipay-Client-Secret": process.env.INV_SECRET,
                    "X-Ipay-Outlet-Id": "192785",
                    "X-Ipay-Endpoint-Ip": "216.48.190.93"
                },
                httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }) // Disable SSL verification
            }
        );

        const result = response.data;

        // Process response

        let data = [];
        let meta = {};

        console.log(result);
        
        if(result.statuscode == "TXN"){
          
            
            resolve(result);  
        }else{
            reject([])
        }
        
        
    });

    

}


function _validateCard(bin){
    return new Promise(async (resolve,reject)=>{
        const sess = `${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

        // Prepare the HTTP request
        const response = await axios.post(
            "https://api.instantpay.in/identity/binChecker",
            {
               binNumber: bin,
                latitude: "38.8951",
                longitude: "77.0364",
                externalRef: sess
            },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-Ipay-Auth-Code": "1",
                    "X-Ipay-Client-Id": process.env.INV_ID,
                    "X-Ipay-Client-Secret": process.env.INV_SECRET,
                    "X-Ipay-Outlet-Id": "192785",
                    "X-Ipay-Endpoint-Ip": "216.48.190.93"
                },
                httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }) // Disable SSL verification
            }
        );

        const result = response.data;

        // Process response

        let data = {};
        console.log(result);
        
        if(result.statuscode == "TXN"){
            data.cardNetwork = result.data.binDetails.cardNetwork;
            data.cardType = result.data.binDetails.cardType;
            data.issuerBank = result.data.binDetails.issuerBank;
          
            resolve(data);  
        }else{
            reject({})
        }
        
        
    });

    

}



function _initTransaction(model){
    
    return new Promise((resolve,reject)=>{
        var query = "INSERT INTO bill_transaction_master (userid,billtype,billername,billerid,billnumber,mobilenumber,amount,createdby,enquiryid) VALUES ("+model.userid+",'"+model.billtype+"','"+model.billername+"','"+model.billerid+"','"+model.billnumber+"','"+model.mobilenumber+"',"+model.billamount+","+model.userid+",'"+model.enquiryid+"');";
        sql.query(query,(err,res)=>{
                if(err){
                    console.log('Bill Create Failed due to '+err);
                    reject(err);
                    return;
                }
                
                var orderid = res.insertId;
                let convenienceFee = (model.amount * global.billPayCommission/100).toFixed(2);
                
                sql.query("INSERT INTO `transaction_master` (`userid`, `amount`, `transtype`, `orderid`, `paymentstatus`,`commissionpercentage`,`commissionamount`,`settlementamount`) SELECT userid,amount,'bill',billid,1,?,?,amount - ? FROM bill_transaction_master WHERE billid = ?;",[global.billPayCommission,parseFloat(convenienceFee),parseFloat(convenienceFee),orderid],(err,res)=>{
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

function _insertIPayLog(sess,request){
    sql.query("INSERT INTO `instantpay_log` (`refid`, `request`) VALUES (? ,? );",[sess,JSON.stringify(request)],(err,res)=>{
        if(err){
            console.log(err);
            
            return;
        }
        
    })
}
function _updateIPayLog(sess,response,ipay_id){
    sql.query("UPDATE `instantpay_log` SET `response` = ? AND ipayid = ? WHERE refid = ?;",[JSON.stringify({response}),"123",sess],(err,res)=>{
        if(err){
            console.log(err);
            
            return;
        }

        console.log("Data Inserted");
        
        
    })
}


function _aesEncryption(text) {

    const IV = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', "4c9655e2cc77331e4c9655e2cc77331e", IV);
    let encrypted = cipher.update("5334670026199774", 'utf8', 'hex'); // Input as UTF-8, output as hex
    encrypted += cipher.final('hex'); // Finalize the encryption
    return { encryptedData: encrypted, iv: IV.toString('hex') };
}

module.exports = BillPayments;