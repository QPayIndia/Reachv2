const { json } = require('express');
const sql = require('./db.js');

const BusinessInfo = function(model){
    this.uid = model.uid,
    
    this.name = model.name,
    this.legalname = model.legalname,
    this.category = model.category,
    this.categoryid = model.categoryid,
    this.subcategory = model.subcategory,
    this.subcategoryid = model.subcategoryid,
    this.est = model.est,
    this.type = model.type,
    this.turnover = model.turnover,
    this.fy = model.fy,
    this.noofemp = model.noofemp,
    this.createdby = model.uid
    // this.createdon = model.createdon
}

const BusinessTimings = function(model){
    this.uid = model.uid,
    
    this.monfrom = model.monfrom,
    this.monto = model.monto,
    this.tuefrom = model.tuefrom,
    this.tueto = model.tueto,
    this.wedfrom = model.wedfrom,
    this.wedto = model.wedto,
    this.thurfrom = model.thurfrom,
    this.thurto = model.thurto,
    this.frifrom = model.frifrom,
    this.frito = model.frito,
    this.satfrom = model.satfrom,
    this.satto = model.satto,
    this.sunfrom = model.sunfrom,
    this.sunto = model.sunto,
    this.createdby = model.uid
    // this.createdon = model.createdon
}

BusinessInfo.create = (model,result)=>{
   
    getBusinessInfo(model.uid).then((data)=>{
        if(data.length > 0){
            console.log("Info Already present")
            updateInfo(model).then((id)=>{
                result(null,{status:"success",message:"Business Info Updated Successfully",data:id});
            }).catch(({
        
            }));
        }else{
            addInfo(model).then((id)=>{
                result(null,{status:"success",message:"Business Info Inserted Successfully",data:id});
            }).catch(({
        
            }));
        }
    })
    
    
    
}


function addInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO business_info SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Business Info Failed due to '+err);
                    return;
                }
                console.log('Business Info Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function updateInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE business_info SET ? WHERE uid = ?",[model,model.uid],(err,res)=>{
                if(err){
                    
                    console.log('Business Info Failed due to '+err);
                    return;
                }
                console.log('Business Info Updated successfully');
                resolve(res.insertId);
            })
    });
}



BusinessInfo.getData = (uid,result)=>{
    
    getBusinessInfo(uid).then((data)=>{
        getAllCategory().then((category)=>{
            getBusinessTimings(uid).then((timings)=>{
                result(null,{status:"success",message:"Business Info Fetched Successfully",data:data[0],category:category,timing:timings});

            });
        })
        
    })

    
}
BusinessInfo.getSubCategory = (id,result)=>{
    
    getSubCategory(id).then((data)=>{
        
            result(null,{status:"success",message:"Sub Category Info Fetched Successfully",data:data});
     
        
    })

    
}

function getBusinessInfo(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM business_info WHERE uid = ? LIMIT 1",[uid],(err,data)=>{
            if(err){
                result(err,{status:"failure",message:err,data:{}});
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}



function getAllCategory(){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT categoryid,name FROM category_master",(err,data)=>{
            if(err){
                reject();
                
                return;
            }

            resolve(data);
    
        })
    })
}
function getSubCategory(id){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT subcategoryid,categoryid,name FROM sub_category_master WHERE categoryid = ?",[id],(err,data)=>{
            if(err){
                reject();
                
                return;
            }

            resolve(data);
    
        })
    })
}


function getBusinessTimings(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM business_timings WHERE uid = ? LIMIT 1",[uid],(err,data)=>{
            if(err){
                reject();
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}


function addTimings(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO business_timings SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Business Info Failed due to '+err);
                    return;
                }
                console.log('Business Timings Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function updateTimings(model){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE business_timings SET ? WHERE uid = ?",[model,model.uid],(err,res)=>{
                if(err){
                    
                    console.log('Business Timings Failed due to '+err);
                    return;
                }
                console.log('Business Timings Updated successfully');
                resolve(res.insertId);
            })
    });
}




module.exports = BusinessInfo;