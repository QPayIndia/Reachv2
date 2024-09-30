const { json } = require('express');
const sql = require('./db.js');
const { add } = require('./userModel.js');
const { domain, deliveryStatus, servicestatus } = require('../config/globals.js');

const BusinessReports = function(model){
}




BusinessReports.getReports = (bid,type,status,fromdate,todate,result)=>{
    

    if(type==='product'){
        getMerchantProductOrders(bid,status,fromdate,todate).then((rows)=>{
            result(null,{status:"success",message:"Orders Fetched Successfully",data:rows});
            
        }).catch((err)=>{
            result(err,{status:"failure",message:"Orders Fetch Failed"});
        })
        
    }else if (type === 'service'){
        getMerchantServiceOrders(bid,status,fromdate,todate).then((rows)=>{
            result(null,{status:"success",message:"Orders Fetched Successfully",data:rows});
            
        }).catch((err)=>{
            result(err,{status:"failure",message:"Orders Fetch Failed"});
        })
    }else if (type === 'transaction'){
        getTransactions(bid,fromdate,todate).then((rows)=>{
            result(null,{status:"success",message:"Transactions Fetched Successfully",data:rows});
            
        }).catch((err)=>{
            result(err,{status:"failure",message:"Transactions Fetch Failed"});
        })
    }else{
        result('',{status:"failure",message:"Orders Fetch Failed"});
    }
   
}


function getMerchantProductOrders(bid,status,fromdate,todate){
    return new Promise((resolve,reject)=>{
        var query = "SELECT A.transactionid,D.productid as itemid,C.orderid,C.orderitemid,A.amount,C.deliverystatus,D.name,D.productimg as itemimage,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date FROM `transaction_master` as A,`order_master` as B,`product_order_items` as C,`product_master` as D WHERE transtype = 'order' AND D.uid = ? AND D.productid = C.productid AND A.orderid = C.orderid AND A.paymentstatus = 1 AND C.deliverystatus = "+status+ " AND C.createdon >= ? AND C.createdon <= ?  AND C.orderid = B.orderid ORDER BY A.orderid DESC;"
        if (status === 0) query = "SELECT A.transactionid,D.productid as itemid,C.orderid,C.orderitemid,A.amount,C.deliverystatus,D.name,D.productimg as itemimage,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date FROM `transaction_master` as A,`order_master` as B,`product_order_items` as C,`product_master` as D WHERE transtype = 'order' AND D.uid = ? AND D.productid = C.productid AND A.orderid = C.orderid AND A.paymentstatus = 1 AND C.createdon >= ? AND C.createdon <= ?  AND C.orderid = B.orderid ORDER BY A.orderid DESC;"
        sql.query(query,[bid,fromdate,todate],(err,data)=>{
            if(err){
                console.log("Get Merchant Orders Failed : "+err);
                reject(err);
                return;
            }
           console.log('Merchant Orders Fetched Successfully for : '+bid);
           for(let i =0 ; i< data.length ; i++){
            data[i]['itemimage'] = domain+data[i]['itemimage'];
            data[i]['deliverystatus'] = deliveryStatus[data[i]['deliverystatus']];
           }
           resolve(data);
    
           
            
        })
    })
}

function getMerchantServiceOrders(bid,status,fromdate,todate){
    return new Promise((resolve,reject)=>{
        var query = "SELECT A.transactionid,D.serviceid as itemid,C.orderid,C.orderitemid,A.amount,C.deliverystatus,D.name,D.serviceimg as itemimage,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date FROM `transaction_master` as A,`order_master` as B,`service_order_items` as C,`service_master` as D WHERE transtype = 'order' AND D.uid = ? AND D.serviceid = C.serviceid AND A.orderid = C.orderid AND A.paymentstatus = 1 AND C.deliverystatus = "+status+ " AND C.orderid = B.orderid AND C.createdon >= ? AND C.createdon <= ?  ORDER BY A.orderid DESC;";
        if (status === 0) query = "SELECT A.transactionid,D.serviceid as itemid,C.orderid,C.orderitemid,A.amount,C.deliverystatus,D.name,D.serviceimg as itemimage,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date FROM `transaction_master` as A,`order_master` as B,`service_order_items` as C,`service_master` as D WHERE transtype = 'order' AND D.uid = ? AND D.serviceid = C.serviceid AND A.orderid = C.orderid AND A.paymentstatus = 1 AND C.orderid = B.orderid AND C.createdon >= ? AND C.createdon <= ? ORDER BY A.orderid DESC;"
        console.log(query);
        
        sql.query(query,[bid,fromdate,todate],(err,data)=>{
            if(err){
                console.log("Get Merchant Orders Failed : "+err);
                reject(err);
                return;
            }
           console.log('Merchant Orders Fetched Successfully for : '+bid);
           for(let i =0 ; i< data.length ; i++){
            data[i]['itemimage'] = domain+data[i]['itemimage'];
            data[i]['deliverystatus'] = servicestatus[data[i]['deliverystatus']];
           }
           resolve(data);
    
           
            
        })
    })
}

function getTransactions(userid,fromdate,todate){
    var query = "";
   
    query = "SELECT A.amount,A.transactionid,A.userid,A.bid,B.photo as profile,B.name,B.phone,A.commissionpercentage,A.commissionamount,A.settlementamount,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date FROM transaction_master as A,user_master as B WHERE A.bid = "+userid+" AND A.userid = B.uid AND A.createdon >= '"+fromdate+"' AND A.createdon <= '"+todate+"'  ORDER BY A.transactionid DESC;";
   
    return new Promise((resolve,reject)=>{
        sql.query(query,[userid],(err,data)=>{
            if(err){
                console.log("Get Transaction List Failed : "+userid);
                console.log("Get Transaction List Failed : "+err);
                
                reject(err);
                return;
            }
           console.log("Transaction List Fetched Successfully - "+userid);
         
           resolve(data);
    
           
            
        })
    })
}



module.exports = BusinessReports;