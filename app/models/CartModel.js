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
        sql.query("SELECT A.cartid,A.productid,B.productimg,B.name,B.price,B.totalrating as rating,B.reviewCount as review,A.qty FROM product_cart_master as A,product_master as B WHERE A.userid = ? AND A.productid = B.productid; ",[uid],(err,data)=>{
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