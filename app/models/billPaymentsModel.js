const { json } = require('express');
const sql = require('./db.js');

const BillPayments = function(model){

}

BillPayments.getPrepaidPlans = (userid,billerid,circle,result)=>{
   
    _getPrepaidPlans(billerid,circle).then((data)=>{
        result(null,{status:"success",message:"Prepaid Plans Fetched Successfully",data:data});
    }).catch((err)=>{
        result(err,{status:"failure",message:"Prepaid Plans Fetch Failed",data:[]});
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

            let rawData = JSON.parse(data[0]['jsonPlan'])['data']['plans'];
            let parsedData = [];
            
            for(let i=0; i< rawData.length ; i++){
                let model = {};
                model['planid'] = rawData[i]['_id'];
                model['amount'] = rawData[i]['planAmount'];
                model['validity'] = rawData[i]['planValidity'];
                model['description'] = rawData[i]['planDescription'];
               
                parsedData[i] = model;
            }
            
    
            resolve(parsedData);
        })
    })
}

function _getBillDetails(){
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
                    "X-Ipay-Client-Id": clientSecret[0]?.client_Id,
                    "X-Ipay-Client-Secret": clientSecret[0]?.client_secret,
                    "X-Ipay-Outlet-Id": clientOutletId.outlet_id,
                    "X-Ipay-Endpoint-Ip": "216.48.190.93"
                },
                httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }) // Disable SSL verification
            }
        );

        const result = response.data;

        // Process response
        if (result) {
            if (
                result.statuscode === "TXN" &&
                result.status === "Transaction Successful"
            ) {
                result.data.ipay_id = result.data.enquiryReferenceId;
                result.data.billamount = result.data.BillAmount;
                result.data.billduedate = result.data.BillDueDate;
                result.data.customername = result.data.CustomerName;
                result.data.additionalinfo = result.data.AdditionalDetails;
            }
            return res.json(result);
        } else {
            return res.json(message);
        }
    });

    

}


































BillPayments.create = (model,ownerid,result)=>{

    if(ownerid === 0){
        addOwnerModel(model).then((id)=>{
            result(null,{status:"success",message:"Owner Inserted Successfully",data:id});
        }).catch((err)=>{
            result(err,{status:"failure",message:"Owner Insert Failed"});
        });
    }else{
        
        
        updateOwnerModel(model,ownerid).then((id)=>{
            result(null,{status:"success",message:"Owner Updated Successfully",data:id});
        }).catch((err)=>{
            console.log(err);
            result(err,{status:"failure",message:"Owner Update Failed"});
        });
    }
   
    
    
    
    
}
BillPayments.deleteOwner = (uid,ownerid,result)=>{
   
    deleteData(uid,ownerid).then((id)=>{
        result(null,{status:"success",message:"Owner Deleted Successfully",data:id});
    }).catch(({

    }));
    
    
    
}

function addOwnerModel(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO owner_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Owner Insert Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Owner Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function updateOwnerModel(model,ownerid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE owner_master SET ? WHERE ownerid = ?",[model,ownerid],(err,res)=>{
                if(err){
                    
                    console.log('Owner Update Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Owner Updated successfully');
                resolve(ownerid);
            })
    });
}



function deleteData(uid,ownerid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM owner_master WHERE ownerid = ? AND uid = ?",[ownerid,uid],(err,data)=>{
            if(err){
                reject();
                
                return;
            }
    
    
            resolve();
        })
    })
}




module.exports = BillPayments;