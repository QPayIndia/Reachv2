
const sql = require('./db.js');
require('dotenv').config();
const axios = require('axios');
const { log } = require('console');
const global = require('../config/globals.js');

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

BillPayments.getBillDetails = (operator,cutomerMobile,result)=>{
   
    _getBillDetails(operator,cutomerMobile).then((data)=>{
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

function _getBillDetails(operator,customerId){
    return new Promise(async (resolve,reject)=>{
        const sess = `${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

        // Prepare the HTTP request
        const response = await axios.post(
            "https://api.instantpay.in/marketplace/utilityPayments/prePaymentEnquiry",
            {
                billerId: operator,
                initChannel: "AGT",
                externalRef: sess,
                inputParameters: {
                    param1: customerId,
                    param2: ""
                },
                deviceInfo: {
                    mac: "02-00-AC-10-7A-99",
                    ip: "164.52.211.128"
                },
                remarks: {
                    param1: "9940620016"
                },
                transactionAmount: 10
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

        let data = {}
                data.ipay_id = "";
                data.billamount = "";
                data.billduedate = "";
                data.customername = "";
                data.additionalinfo = "";
                data.status = "Unable to fetch bill";

        if (result) {

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
        var query = "INSERT INTO bill_transaction_master (userid,billtype,billername,billerid,billnumber,mobilenumber,amount,createdby) VALUES ("+model.userid+",'"+model.billtype+"','"+model.billername+"','"+model.billerid+"','"+model.billnumber+"','"+model.mobilenumber+"',"+model.amount+","+model.userid+");";
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

module.exports = BillPayments;