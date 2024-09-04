const { json } = require('express');
const sql = require('./db.js');
const { domain } = require('../config/globals.js');
const { deliveryStatus } = require('../config/globals.js');

const OrderModel = function(model){
   
  
    
    
}




OrderModel.getData = (userid,type,result)=>{
    

    if(type==='product'){
        getProductOrders(userid).then((rows)=>{
            result(null,{status:"success",message:"Orders Fetched Successfully",data:rows});
            
        }).catch((err)=>{
            result(err,{status:"failure",message:"Orders Fetch Failed"});
        })
        
    }else if (type === 'service'){

    }else{
        result('',{status:"failure",message:"Orders Fetch Failed"});
    }
   
}

OrderModel.getMerchantOrders = (bid,type,result)=>{
    

    if(type==='product'){
        getMerchantOrders(bid).then((rows)=>{
            result(null,{status:"success",message:"Orders Fetched Successfully",data:rows});
            
        }).catch((err)=>{
            result(err,{status:"failure",message:"Orders Fetch Failed"});
        })
        
    }else if (type === 'service'){

    }else{
        result('',{status:"failure",message:"Orders Fetch Failed"});
    }
   
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



function getProductOrders(userId){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT DISTINCT A.orderid,D.orderitemid,B.paymentstatus,C.productid,D.deliverystatus,C.name,C.productimg FROM `order_master` as A,`transaction_master` as B,`product_master` as C,`product_order_items` as D WHERE A.orderid = B.orderid AND A.orderid = D.orderid AND D.productid = C.productid AND A.userid = ?;",[userId],(err,data)=>{
            if(err){
                console.log("Get Orders Failed : "+err);
                reject(err);
                return;
            }
           console.log('Orders Fetched Successfully for : '+userId);
           for(let i =0 ; i< data.length ; i++){
            data[i]['productimg'] = domain+data[i]['productimg'];
            data[i]['deliverystatus'] = deliveryStatus[data[i]['deliverystatus']];
           }
           resolve(data);
    
           
            
        })
    })
}

function getMerchantOrders(bid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.transactionid,D.productid,C.orderid,A.amount,C.deliverystatus,D.name,D.productimg,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date FROM `transaction_master` as A,`order_master` as B,`product_order_items` as C,`product_master` as D WHERE transtype = 'order' AND D.uid = ? AND D.productid = C.productid AND A.orderid = C.orderid AND A.paymentstatus = 1 AND C.orderid = B.orderid;",[bid],(err,data)=>{
            if(err){
                console.log("Get Merchant Orders Failed : "+err);
                reject(err);
                return;
            }
           console.log('Merchant Orders Fetched Successfully for : '+bid);
           for(let i =0 ; i< data.length ; i++){
            data[i]['productimg'] = domain+data[i]['productimg'];
            data[i]['deliverystatus'] = deliveryStatus[data[i]['deliverystatus']];
           }
           resolve(data);
    
           
            
        })
    })
}










module.exports = OrderModel;