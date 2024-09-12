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
    this.rentFlag = model.rentFlag,
    this.units = model.units,
    this.minprice = model.minprice,
    this.maxprice = model.maxprice,
    this.minqty = model.minqty,
    this.maxqty = model.maxqty,
    this.createdby = model.createdby
    // this.createdon = model.createdon
}

const SpecModel = function(model){
   
    this.title = model.title,
    this.productid = model.productid,
    this.value = model.value,
    this.uid = model.uid
    
}



ProductModel.create = (model,specs,result)=>{

    addProductData(model).then((id)=>{

        if(specs != null){
            addProductSpec(specs,id,model.uid).then(()=>{
                result(null,{status:"success",message:"Product Data Inserted Successfully",data:id});
            })
        }else{
            result(null,{status:"success",message:"Product Data Inserted Successfully"});
        }

        
        
    }).catch(({

    }));
    
    
    
}
ProductModel.updateProduct = (model,productid,specs,result)=>{

    updateProductData(model,productid).then(()=>{
        if(specs != null){
            addProductSpec(specs,productid,model.uid).then(()=>{
                result(null,{status:"success",message:"Product Data Inserted Successfully"});
            })
        }else{
            result(null,{status:"success",message:"Product Data Inserted Successfully"});
        }
        
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
function addProductSpec(specs,id,uid){
    return new Promise((resolve,reject)=>{
        
        specs.forEach(temp => {
            if(temp['title'] != "" && temp['value'] != ""){
                const model = new SpecModel({
                    title: temp['title'],
                    value:temp['value'],
                    productid:id,
                    uid:uid
                });
                sql.query("INSERT INTO product_spec_master SET ?",model,(err,res)=>{
                    if(err){
                        
                        console.log('Product Data Insert Failed due to '+err);
                        return;
                    }
                    console.log('Product Spec Data Inserted successfully');
                    
                })
            }

            

            
        })
        resolve();
        
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
                resolve();
            })
    });
}

ProductModel.getProductSpec = (uid,result)=>{
    
    getProductSpec(uid).then((data)=>{
       
        result(null,{status:"success",message:"Product Spec Fetched Successfully",data:data});
    })

    
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
ProductModel.deleteProductSpec = (productid,pspecid,result)=>{
    
    deleteProductSpec(pspecid).then(()=>{
        result(null,{status:"success",message:"Product Spec Deleted Successfully",});
    })

    
}

function getProductData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM product_master WHERE product_master.uid = ?",[uid],(err,data)=>{
            if(err){
                resolve([]);
                console.log("Get Product Data :"+err);
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}
function getProductSpec(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT pspecid,title,value FROM product_spec_master WHERE productid = ?",[uid],(err,data)=>{
            if(err){
                resolve([]);
                console.log("Get Product Spec :"+err);
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
function deleteProductSpec(pspecid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM product_spec_master WHERE pspecid = ?",[pspecid],(err,data)=>{
            if(err){
                reject();
                
                return;
            }
    
    
            resolve();
        })
    })
}



module.exports = ProductModel;