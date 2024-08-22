const { json } = require('express');
const sql = require('./db.js');
const global = require('../config/globals.js');

const CartModel = function(model){
    this.userid = model.userid,
    this.productid = model.id,
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
    addToProductCart(model).then((id)=>{
        result(null,{status:"success",message:"Service added to cart Successfully",data:id});
    }).catch(({

    }));
   }else{
    result("",{status:"failure",message:"Undefined Cart Type"});
   }
    
    
    
}


CartModel.updateCart = (uid,cartid,ischecked,qty,type,result)=>{
    
    
   if(type === 'product'){
    
    if(qty === 0){
        DeleteProductCart(uid,cartid).then(()=>{
            result(null,{status:"success",message:"Product Cart Data Updated Successfully"});
        }).catch((err)=>{
            result(err,{status:"failure",message:err});
        })
    }else{
        updateProductCart(uid,cartid,ischecked,qty).then(()=>{
            result(null,{status:"success",message:"Product Cart Data Updated Successfully"});
        }).catch((err)=>{
            result(err,{status:"failure",message:err});
        })
    }
   }else{

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
function updateProductCart(uid,productid,ischecked,qty){
    
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE product_cart_master SET ischecked = ?,qty = ? WHERE cartid = ? AND userid = ?",[ischecked,qty,productid,uid],(err,res)=>{
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
    
    getProductCart(uid).then((data)=>{
        result(null,{status:"success",message:"Product Cart Data Fetched Successfully",data:data});
    })

    
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