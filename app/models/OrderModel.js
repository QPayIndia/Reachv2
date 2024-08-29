const { json } = require('express');
const sql = require('./db.js');
const { domain } = require('../config/globals.js');

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
        sql.query("SELECT A.orderid,D.orderitemid,B.paymentstatus,C.productid,D.deliverystatus,C.name,C.productimg FROM `order_master` as A,`transaction_master` as B,`product_master` as C,`product_order_items` as D WHERE A.orderid = B.orderid AND A.orderid = D.orderid AND D.productid = C.productid AND A.userid = ?;",[userId],(err,data)=>{
            if(err){
                console.log("Get Orders Failed : "+err);
                reject(err);
                return;
            }
           console.log('Orders Fetched Successfully for : '+userId);
           for(let i =0 ; i< data.length ; i++){
            data[i]['productimg'] = domain+data[i]['productimg'];
           }
           resolve(data);
    
           
            
        })
    })
}










module.exports = OrderModel;