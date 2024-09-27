const { json } = require('express');
const sql = require('./db.js');
const global = require('../config/globals.js');

const CartModel = function(model){
    this.userid = model.userid,
    this.productid = model.productid,
    this.ischecked = model.ischecked,
    this.qty = model.qty
   
}
 const ServiceCartModel = function(model){
    this.userid = model.userid,
    this.serviceid = model.serviceid,
    this.ischecked = model.ischecked,
    this.qty = model.qty
   
}



CartModel.create = (model,type,result)=>{
   
   

   if(type == "product"){
    addToProductCart(model).then((id)=>{
        result(null,{status:"success",message:"Product added to cart Successfully",data:id});
    }).catch(({

    }));
   }else if (type == "service"){
    addToServiceCart(model).then((id)=>{
        result(null,{status:"success",message:"Service added to cart Successfully",data:id});
    }).catch(({

    }));
   }else{
    result("",{status:"failure",message:"Undefined Cart Type"});
   }
    
    
    
}


CartModel.Checkout = (userid,type,result)=>{
   
   

    if(type == "product"){
     CheckoutProductCart(userid).then((id)=>{
         result(null,{status:"success",message:"Checkout Successfully",transactionId:id});
     }).catch((err)=>{
        result(err,{status:"failure",message:"Checkout Failed"});
     });
    }else if (type == "service"){
        CheckoutServiceCart(userid).then((id)=>{
            result(null,{status:"success",message:"Checkout Successfully",transactionId:id});
        }).catch((err)=>{
           result(err,{status:"failure",message:"Checkout Failed"});
        });
    }else{
     result("",{status:"failure",message:"Undefined Cart Type"});
    }
     
     
     
 }


CartModel.updateCart = (uid,cartid,ischecked,qty,type,result)=>{
    
    
   if(type === 'product'){
    
    if(qty === 0){
        DeleteProductCart(uid,cartid).then(()=>{
            getCartValue(uid).then((value)=>{
                result(null,{status:"success",message:"Product Cart Data Updated Successfully",cart:value});
            }).catch((err)=>{
                result(null,{status:"success",message:"Product Cart Data Updated Successfully",cart:{price:0,items:0}});
            })
        }).catch((err)=>{
            result(err,{status:"failure",message:err});
        })
    }else{
        updateProductCart(uid,cartid,ischecked,qty).then(()=>{
            getCartValue(uid).then((value)=>{
                result(null,{status:"success",message:"Product Cart Data Updated Successfully",cart:value});
            }).catch((err)=>{
                result(null,{status:"success",message:"Product Cart Data Updated Successfully",cart:{price:0,items:0}});
            })
            
        }).catch((err)=>{
            result(err,{status:"failure",message:err});
        })
    }
   }else{
    if(qty === 0){
        DeleteServiceCart(uid,cartid).then(()=>{
            getServiceCartValue(uid).then((value)=>{
                result(null,{status:"success",message:"Service Cart Data Updated Successfully",cart:value});
            }).catch((err)=>{
                result(null,{status:"success",message:"Service Cart Data Updated Successfully",cart:{price:0,items:0}});
            })
        }).catch((err)=>{
            result(err,{status:"failure",message:err});
        })
    }else{
        updateServiceCart(uid,cartid,ischecked,qty).then(()=>{
            getServiceCartValue(uid).then((value)=>{
                result(null,{status:"success",message:"Service Cart Data Updated Successfully",cart:value});
            }).catch((err)=>{
                result(null,{status:"success",message:"Service Cart Data Updated Successfully",cart:{price:0,items:0}});
            })
            
        }).catch((err)=>{
            result(err,{status:"failure",message:err});
        })
    }
   }

    
}
// CartModel.updateService = (model,serviceid,result)=>{
   
   

//     updateServiceData(model,serviceid).then(()=>{
//         result(null,{status:"success",message:"Service Inserted Successfully"});
//     }).catch(({

//     }));
    
    
    
//}

function addToProductCart(model){
    console.log(model);
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO product_cart_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Cart Insert Failed due to '+err);
                    return;
                }
                console.log('Cart Inserted successfully');
                resolve(res.insertId);
            })
    });
}

function CheckoutProductCart(userid){
    
    return new Promise((resolve,reject)=>{
        var query = "INSERT INTO order_master (amount, addressid,userid,carttype) SELECT SUM(C.price * A.qty) as amount,B.addressid,B.userid,'product' FROM `product_cart_master` as A,`address_master` as B,`product_master` as C WHERE A.userid = "+userid+" AND A.ischecked = 1 AND A.userid = B.userid AND B.isprimary = 1  AND A.productid = C.productid;";
        sql.query(query,(err,res)=>{
                if(err){
                    console.log('Cart Checkout Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Cart Checkout successfully');
                var orderid = res.insertId;
                    sql.query('INSERT INTO product_order_items (orderid, productid,deliverystatus,priceperunit,qty,totalamount) SELECT ?,A.productid as productid,1,B.price,A.qty,B.price * A.qty FROM `product_cart_master` as A,`product_master` as B WHERE A.userid = ?  AND A.ischecked = 1 AND A.productid = B.productid;',[orderid,userid],(err,res)=>{
                        if(err){
                            console.log('Checkout Items Adding to cart Failed due to '+err);
                            reject(err);
                            return;
                        }
                        console.log('Checkout Items Added successfully');
                            sql.query("INSERT INTO `transaction_master` (`userid`, `amount`, `transtype`, `orderid`, `paymentstatus`,`commissionpercentage`,`commissionamount`,`settlementamount`) SELECT userid,amount,'order',orderid,1,?,amount * ?/100,amount - (amount * ?/100) FROM order_master WHERE orderid = ?;",[orderid,pgCommission,pgCommission,pgCommission ],(err,res)=>{
                                if(err){
                                    console.log('Transaction create Failed due to '+err);
                                    reject(err);
                                    return;
                                }
                                console.log('Transaction created successfully : '+res.insertId);
                                resolve(res.insertId);
                            })
                    })
                
            })
    });
}


function CheckoutServiceCart(userid){
    
    return new Promise((resolve,reject)=>{
        var query = "INSERT INTO order_master (amount, addressid,userid,carttype) SELECT SUM(C.price * A.qty) as amount,B.addressid,B.userid,'service' FROM `service_cart_master` as A,`address_master` as B,`service_master` as C WHERE A.userid = "+userid+" AND A.ischecked = 1 AND A.userid = B.userid AND B.isprimary = 1 AND A.serviceid = C.serviceid;";
        sql.query(query,(err,res)=>{
                if(err){
                    console.log('Cart Checkout Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Cart Checkout successfully');
                var orderid = res.insertId;
                    sql.query('INSERT INTO service_order_items (orderid, serviceid,deliverystatus,priceperunit,qty,totalamount) SELECT ?,A.serviceid as serviceid,1,B.price,A.qty,B.price * A.qty FROM `service_cart_master` as A,`service_master` as B WHERE A.userid = ? AND A.ischecked = 1 AND A.serviceid = B.serviceid;',[orderid,userid],(err,res)=>{
                        if(err){
                            console.log('Checkout Items Adding to cart Failed due to '+err);
                            reject(err);
                            return;
                        }
                        console.log('Checkout Items Added successfully');
                            sql.query("INSERT INTO `transaction_master` (`userid`, `amount`, `transtype`, `orderid`, `paymentstatus`,`commissionpercentage`,`commissionamount`,`settlementamount`) SELECT userid,amount,'order',orderid,1,?,amount * ?/100,amount - (amount * ?/100) FROM order_master WHERE orderid = ?;",[orderid,pgCommission,pgCommission,pgCommission],(err,res)=>{
                                if(err){
                                    console.log('Transaction create Failed due to '+err);
                                    reject(err);
                                    return;
                                }
                                console.log('Transaction created successfully : '+res.insertId);
                                resolve(res.insertId);
                            })
                    })
                
            })
    });
}

function addToServiceCart(model){
    console.log(model);
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO service_cart_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Service Cart Insert Failed due to '+err);
                    return;
                }
                console.log('Service Cart Inserted successfully');
                resolve(res.insertId);
            })
    });
}

function DeleteProductCart(uid,productid){
    return new Promise((resolve,reject)=>{
      sql.query("DELETE FROM product_cart_master WHERE cartid = ? AND userid = ?",[productid,uid],(err,res)=>{
        if(err){
            reject(err);
            console.log("Product Delete Failed");
            return;
        }
        console.log("Product Deleted Successfully");
        resolve();
        
        
    })
    })
  }
function DeleteServiceCart(uid,productid){
    return new Promise((resolve,reject)=>{
      sql.query("DELETE FROM service_cart_master WHERE cartid = ? AND userid = ?",[productid,uid],(err,res)=>{
        if(err){
            reject(err);
            console.log("Service Delete Failed");
            return;
        }
        console.log("Service Deleted Successfully");
        resolve();
        
        
    })
    })
  }
function updateProductCart(uid,cartid,ischecked,qty){
    
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE product_cart_master SET ischecked = ?,qty = ? WHERE cartid = ? AND userid = ?",[ischecked,qty,cartid,uid],(err,res)=>{
                if(err){
                    
                    console.log('Cart Update Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Cart Updated successfully');
                resolve();
            })
    });
}
function updateServiceCart(uid,cartid,ischecked,qty){
    
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE service_cart_master SET ischecked = ?,qty = ? WHERE cartid = ? AND userid = ?",[ischecked,qty,cartid,uid],(err,res)=>{
                if(err){
                    
                    console.log('Cart Update Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Cart Updated successfully');
                resolve();
            })
    });
}
// function updateServiceData(model,serviceid){
//     return new Promise((resolve,reject)=>{
//         sql.query("UPDATE service_master SET ? WHERE serviceid = ?",[model,serviceid],(err,res)=>{
//                 if(err){
                    
//                     console.log('Service Update Failed due to '+err);
//                     return;
//                 }
//                 console.log('Service Updated successfully');
//                 resolve();
//             })
//     });
// }



CartModel.getData = (uid,type,result)=>{
    
    if(type === "product"){
        getProductCart(uid).then((data)=>{
            getCartValue(uid).then((value)=>{
                result(null,{status:"success",message:"Product Cart Data Fetched Successfully",data:data,cart:value});
            }).catch((err)=>{
                result(null,{status:"success",message:"Product Cart Data Fetched Successfully",data:data,cart:{price:0,items:0}});
            })
        }).catch((err)=>{
            result(err,{status:"failure",message:"Product Cart Data Fetched Failed",data:[],cart:{price:0,items:0}});
        })
    }else{
        getServiceCart(uid).then((data)=>{
            getServiceCartValue(uid).then((value)=>{
                result(null,{status:"success",message:"Service Cart Data Fetched Successfully",data:data,cart:value});
            }).catch((err)=>{
                result(null,{status:"success",message:"Service Cart Data Fetched Successfully",data:data,cart:{price:0,items:0}});
            })
        }).catch((err)=>{
            result(err,{status:"failure",message:"Service Cart Data Fetched Failed",data:[],cart:{price:0,items:0}});
        })
    }

    
}

// CartModel.deleteService = (uid,productid,result)=>{
    
//     deleteData(uid,productid).then(()=>{
//         result(null,{status:"success",message:"Product Deleted Successfully",});
//     })

    
// }

function getProductCart(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.cartid,A.productid,B.productimg,B.name,B.price,B.totalrating as rating,B.reviewCount as review,A.qty,A.ischecked FROM product_cart_master as A,product_master as B WHERE A.userid = ? AND A.productid = B.productid; ",[uid],(err,data)=>{
            if(err){
                console.log("Get Product Cart Master : "+err);
                
                return;
            }
            for(let i=0;i< data.length; i++){
                data[i]['productimg'] = global.domain+  data[i]['productimg'];
                if(data[i]['rating'] > 0){
                    let rating = data[i]['rating'] / data[i]['review'];
                    data[i]['rating'] = rating.toFixed(1);
                }else{
                    data[i]['rating'] = "0";
                }

                data[i]['ischecked'] = data[i]['ischecked'] === 1 ? true : false;
            }
            console.log('Product Data Fetched successfully');
    
            resolve(data);
    
            
    
           
            
        })
    })
}
function getServiceCart(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.cartid,A.serviceid,B.serviceimg,B.name,B.price,B.totalrating as rating,B.reviewCount as review,A.qty,A.ischecked FROM service_cart_master as A,service_master as B WHERE A.userid = ? AND A.serviceid = B.serviceid; ",[uid],(err,data)=>{
            if(err){
                console.log("Get Service Cart Master : "+err);
                
                return;
            }
            for(let i=0;i< data.length; i++){
                data[i]['serviceimg'] = global.domain+  data[i]['serviceimg'];
                if(data[i]['rating'] > 0){
                    let rating = data[i]['rating'] / data[i]['review'];
                    data[i]['rating'] = rating.toFixed(1);
                }else{
                    data[i]['rating'] = "0";
                }

                data[i]['ischecked'] = data[i]['ischecked'] === 1 ? true : false;
            }
            console.log('Service Data Fetched successfully');
    
            resolve(data);
    
            
    
           
            
        })
    })
}
function getCartValue(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT B.price,A.qty  FROM product_cart_master as A,product_master as B WHERE A.userid = ? AND A.productid = B.productid AND A.ischecked = 1; ",[uid],(err,data)=>{
            if(err){
                console.log("Get Product Cart Value Failed : "+err);
                
                return;
            }
            
            console.log('Product Cart Value Fetched successfully');
            let price = 0;
            for(let i=0;i< data.length; i++){
                price = price + ( data[i]['price'] * data[i]['qty']);    
            }
            resolve({price:price,items:data.length});
    
            
    
           
            
        })
    })
}

function getServiceCartValue(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT B.price,A.qty  FROM service_cart_master as A,service_master as B WHERE A.userid = ? AND A.serviceid = B.serviceid AND A.ischecked = 1; ",[uid],(err,data)=>{
            if(err){
                console.log("Get Service Cart Value Failed : "+err);
                
                return;
            }
            
            console.log('Service Cart Value Fetched successfully');
            let price = 0;
            for(let i=0;i< data.length; i++){
                price = price + ( data[i]['price'] * data[i]['qty']);    
            }
            resolve({price:price,items:data.length});
    
            
    
           
            
        })
    })
}

// function deleteData(uid,serviceid){
//     return new Promise((resolve,reject)=>{
//         sql.query("DELETE FROM service_master WHERE serviceid = ? AND uid = ?",[serviceid,uid],(err,data)=>{
//             if(err){
//                 reject();
                
//                 return;
//             }
    
    
//             resolve();
//         })
//     })
// }



module.exports = CartModel;