const { json } = require('express');
const sql = require('./db.js');

const ProductModel = function(model){
    this.uid = model.uid,
    // this.socialid = model.socialid,
    this.productimg = model.productimg,
    this.name = model.name,
    this.description = model.description,
    this.category = model.category,
    this.businesstype = model.businesstype,
    this.brandname = model.brandname,
    this.origin = model.origin,
    this.pricetype = model.pricetype,
    this.price = model.price,
    this.offerprice = model.offerprice,
    this.units = model.units,
    this.minprice = model.minprice,
    this.maxprice = model.maxprice,
    this.minqty = model.minqty,
    this.maxqty = model.maxqty,
    this.createdby = model.createdby
    // this.createdon = model.createdon
}



ProductModel.create = (model,result)=>{
   
    // getProductData(model.uid).then((data)=>{
    //     if(data.length > 0){
    //         console.log("Info Already present")
    //         updateProductData(model).then((id)=>{
    //             result(null,{status:"success",message:"Product Data Updated Successfully",data:id});
    //         }).catch(({
        
    //         }));
    //     }else{
           
    //     }
    // })

    addProductData(model).then((id)=>{
        result(null,{status:"success",message:"Product Data Inserted Successfully",data:id});
    }).catch(({

    }));
    
    
    
}

function addProductData(model){
    console.log(model);
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO product_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Product Data Insert Failed due to '+err);
                    return;
                }
                console.log('Product Data Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function updateProductData(model,productid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE product_master SET ? WHERE productid = ?",[model,productid],(err,res)=>{
                if(err){
                    
                    console.log('Product Data Update Failed due to '+err);
                    return;
                }
                console.log('Product Data Updated successfully');
                resolve(res.insertId);
            })
    });
}



ProductModel.getData = (uid,result)=>{
    
    getProductData(uid).then((data)=>{
        result(null,{status:"success",message:"Product Data Fetched Successfully",data:data});
    })

    
}

ProductModel.deleteProduct = (uid,productid,result)=>{
    
    deleteData(uid,productid).then(()=>{
        result(null,{status:"success",message:"Product Deleted Successfully",});
    })

    
}

function getProductData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM product_master WHERE uid = ?",[uid],(err,data)=>{
            if(err){
                result(err,{status:"failure",message:err,data:{}});
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}

function deleteData(uid,productid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM product_master WHERE productid = ? AND uid = ?",[productid,uid],(err,data)=>{
            if(err){
                reject();
                
                return;
            }
    
    
            resolve();
        })
    })
}



module.exports = ProductModel;