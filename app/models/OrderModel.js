const { json } = require('express');
const sql = require('./db.js');
const { domain, servicestatus } = require('../config/globals.js');
const { deliveryStatus } = require('../config/globals.js');
const { add } = require('../controllers/cartController.js');

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
        getServiceOrders(userid).then((rows)=>{
            result(null,{status:"success",message:"Orders Fetched Successfully",data:rows});
            
        }).catch((err)=>{
            result(err,{status:"failure",message:"Orders Fetch Failed"});
        })
    }else{
        result('',{status:"failure",message:"Orders Fetch Failed"});
    }
   
}

OrderModel.UpdateStatus = (orderitemid,status,type,result)=>{
    
    status = (status > 0 && status  < 5) ? status : 1;

    if(type==='product'){
        UpdateProductDeliveryStatus(orderitemid,status).then((rows)=>{
            getProductOrderDetails(orderitemid).then((data)=>{
                result(null,{status:"success",message:"Status Updated Successfully",data:data['status']});
                
            }).catch((err)=>{
                result(err,{status:"failure",message:"Status Updated Failed"});
            })
            
            
        }).catch((err)=>{
            result(err,{status:"failure",message:"Status Updated Failed"});
        })
        
    }else if (type === 'service'){
        UpdateServiceDeliveryStatus(orderitemid,status).then((rows)=>{
            getServiceOrderDetails(orderitemid).then((data)=>{
                result(null,{status:"success",message:"Status Updated Successfully",data:data['status']});
                
            }).catch((err)=>{
                result(err,{status:"failure",message:"Status Updated Failed"});
            })
            
            
        }).catch((err)=>{
            result(err,{status:"failure",message:"Status Updated Failed"});
        })
    }else{
        result('',{status:"failure",message:"Orders Fetch Failed"});
    }
   
}

OrderModel.getMerchantOrders = (bid,type,result)=>{
    

    if(type==='product'){
        getMerchantProductOrders(bid).then((rows)=>{
            result(null,{status:"success",message:"Orders Fetched Successfully",data:rows});
            
        }).catch((err)=>{
            result(err,{status:"failure",message:"Orders Fetch Failed"});
        })
        
    }else if (type === 'service'){
        getMerchantServiceOrders(bid).then((rows)=>{
            result(null,{status:"success",message:"Orders Fetched Successfully",data:rows});
            
        }).catch((err)=>{
            result(err,{status:"failure",message:"Orders Fetch Failed"});
        })
    }else{
        result('',{status:"failure",message:"Orders Fetch Failed"});
    }
   
}


OrderModel.getOrderDetails = (orderitemid,type,result)=>{
    

    if(type==='product'){
        getProductOrderDetails(orderitemid).then((details)=>{
            getAddress(details['addressid']).then((address)=>{
                result(null,{status:"success",message:"Orders Details Fetched Successfully",data:details,address:address});
                
            }).catch((err)=>{
                result(null,{status:"success",message:"Orders Details Fetched Successfully",data:details,address:null});
            })
            
        }).catch((err)=>{
            result(err,{status:"failure",message:"Orders Details Fetch Failed"});
        })
        
    }else if (type === 'service'){
        getServiceOrderDetails(orderitemid).then((details)=>{
            getAddress(details['addressid']).then((address)=>{
                result(null,{status:"success",message:"Orders Details Fetched Successfully",data:details,address:address});
                
            }).catch((err)=>{
                result(null,{status:"success",message:"Orders Details Fetched Successfully",data:details,address:null});
            })
            
        }).catch((err)=>{
            result(err,{status:"failure",message:"Orders Details Fetch Failed"});
        })
    }else{
        result('',{status:"failure",message:"Orders Fetch Failed"});
    }
   
}



function UpdateProductDeliveryStatus(orderitemid,staus){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE product_order_items SET deliverystatus = ? WHERE orderitemid = ?;",[staus,orderitemid],(err,res)=>{
                if(err){
                    reject(err);
                    console.log('Update Delivery Status Failed due to '+err);
                    return;
                }
                console.log('Delivery Status Updated Successfully : '+orderitemid);
                resolve();
            })
    });
}

function UpdateServiceDeliveryStatus(orderitemid,staus){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE service_order_items SET deliverystatus = ? WHERE orderitemid = ?;",[staus,orderitemid],(err,res)=>{
                if(err){
                    reject(err);
                    console.log('Update Delivery Status Failed due to '+err);
                    return;
                }
                console.log('Delivery Status Updated Successfully : '+orderitemid);
                resolve();
            })
    });
}



function getProductOrders(userId){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT DISTINCT A.orderid,D.orderitemid,B.paymentstatus,C.productid as itemid,D.deliverystatus,C.name,C.productimg as itemimage FROM `order_master` as A,`transaction_master` as B,`product_master` as C,`product_order_items` as D WHERE A.orderid = B.orderid AND A.orderid = D.orderid AND D.productid = C.productid AND A.userid = ? GROUP BY D.orderitemid ORDER BY A.orderid DESC;",[userId],(err,data)=>{
            if(err){
                console.log("Get Orders Failed : "+err);
                reject(err);
                return;
            }
          
           for(let i =0 ; i< data.length ; i++){
            data[i]['itemimage'] = domain+data[i]['itemimage'];
            data[i]['deliverystatus'] = deliveryStatus[data[i]['deliverystatus']];
           }
           resolve(data);
    
           
            
        })
    })
}

function getServiceOrders(userId){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT DISTINCT A.orderid,D.orderitemid,B.paymentstatus,C.serviceid as itemid,D.deliverystatus,C.name,C.serviceimg as itemimage FROM `order_master` as A,`transaction_master` as B,`service_master` as C,`service_order_items` as D WHERE A.orderid = B.orderid AND A.orderid = D.orderid AND D.serviceid = C.serviceid AND A.userid = ? GROUP BY D.orderitemid ORDER BY A.orderid DESC;",[userId],(err,data)=>{
            if(err){
                console.log("Get Orders Failed : "+err);
                reject(err);
                return;
            }
           console.log('Orders Fetched Successfully for : '+userId);
           for(let i =0 ; i< data.length ; i++){
            data[i]['itemimage'] = domain+data[i]['itemimage'];
            data[i]['deliverystatus'] = servicestatus[data[i]['deliverystatus']];
           }
           resolve(data);
    
           
            
        })
    })
}

function getMerchantProductOrders(bid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.transactionid,D.productid as itemid,C.orderid,C.orderitemid,A.amount,C.deliverystatus,D.name,D.productimg as itemimage,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date FROM `transaction_master` as A,`order_master` as B,`product_order_items` as C,`product_master` as D WHERE transtype = 'order' AND D.uid = ? AND D.productid = C.productid AND A.orderid = C.orderid AND A.paymentstatus = 2 AND C.orderid = B.orderid;",[bid],(err,data)=>{
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

function getMerchantServiceOrders(bid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.transactionid,D.serviceid as itemid,C.orderid,C.orderitemid,A.amount,C.deliverystatus,D.name,D.serviceimg as itemimage,DATE_FORMAT(A.createdon, '%h:%i %p , %d %M %Y') as date FROM `transaction_master` as A,`order_master` as B,`service_order_items` as C,`service_master` as D WHERE transtype = 'order' AND D.uid = ? AND D.serviceid = C.serviceid AND A.orderid = C.orderid AND A.paymentstatus = 2 AND C.orderid = B.orderid;",[bid],(err,data)=>{
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

function getProductOrderDetails(orderitemid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.orderitemid,A.orderid,B.name,B.productimg as image,A.priceperunit,A.qty,A.totalamount,C.addressid,A.deliverystatus as status,DATE_FORMAT(C.createdon, '%h:%i %p , %d %M %Y') as date FROM `product_order_items` as A,`product_master` as B,`order_master` as C WHERE A.orderitemid = ? AND A.productid = B.productid AND A.orderid = C.orderid;",[orderitemid],(err,data)=>{
            if(err){
                console.log("Get Product Order Detail Failed : "+err);
                reject(err);
                return;
            }
           console.log('Get Product Order Detail Fetched Successfully for : '+orderitemid);
           for(let i =0 ; i< data.length ; i++){
            data[i]['image'] = domain+data[i]['image'];
            data[i]['status'] = deliveryStatus[data[i]['status']];
           }
           resolve(data[0]);
    
           
            
        })
    })
}


function getServiceOrderDetails(orderitemid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.orderitemid,A.orderid,B.name,B.serviceimg as image,A.priceperunit,A.qty,A.totalamount,C.addressid,A.deliverystatus as status,DATE_FORMAT(C.createdon, '%h:%i %p , %d %M %Y') as date FROM `service_order_items` as A,`service_master` as B,`order_master` as C WHERE A.orderitemid = ? AND A.serviceid = B.serviceid AND A.orderid = C.orderid;",[orderitemid],(err,data)=>{
            if(err){
                console.log("Get Service Order Detail Failed : "+err);
                reject(err);
                return;
            }
           console.log('Get Service Order Detail Fetched Successfully for : '+orderitemid);
           for(let i =0 ; i< data.length ; i++){
            data[i]['image'] = domain+data[i]['image'];
            data[i]['status'] = servicestatus[data[i]['status']];
           }
           resolve(data[0]);
    
           
            
        })
    })
}

function getAddress(id){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM address_master WHERE addressid = ?",[id],(err,data)=>{
            if(err){
                
                reject(err);
                return;
            }
            let address = {};
            if(data.length > 0){
                address = data[0];
            }

            console.log("Address Fetched Successfully : "+ id);
            resolve(address);
            
            
    
            
    
           
            
        })
    })
}










module.exports = OrderModel;