const { json } = require('express');
const sql = require('./db.js');

const BusinessPhotoModel = function(model){
    this.uid = model.uid,
    // this.pinfoid  = model.pinfoid,
    this.p1=model.p1,
    this.p2=model.p2,
    this.p3=model.p3,
    this.p4=model.p4,
    this.p5=model.p5,
    this.p6=model.p6,
    this.p7=model.p7,
    this.p8=model.p8,
    this.p9=model.p9,
    this.p10=model.p10,
    this.v1=model.v1,
    this.v2=model.v2,
    this.v3=model.v3,
    this.createdby = model.uid
    // this.createdon = model.createdon
}



BusinessPhotoModel.create = (model,result)=>{
   
    getData(model.uid).then((data)=>{
        if(data.length > 0){
            console.log("Info Already present")
            updateInfo(model).then((id)=>{
                result(null,{status:"success",message:"Media Updated Successfully",data:id});
            }).catch(({
        
            }));
        }else{
            addInfo(model).then((id)=>{
                result(null,{status:"success",message:"Media Inserted Successfully",data:id});
            }).catch(({
        
            }));
        }
    })
    
    
    
}

function addInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO business_photo_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Media Insert Failed due to '+err);
                    return;
                }
                console.log('Media Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function updateInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE business_photo_master SET ? WHERE uid = ?",[model,model.uid],(err,res)=>{
                if(err){
                    
                    console.log('Media Insert Failed due to '+err);
                    return;
                }
                console.log('Media Updated successfully');
                resolve(res.insertId);
            })
    });
}



BusinessPhotoModel.getInfo = (uid,result)=>{
    
    getData(uid).then((data)=>{
        result(null,{status:"success",message:"Media Fetched Successfully",data:data[0]});
    })

    
}

function getData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM business_photo_master WHERE uid = ? LIMIT 1",[uid],(err,data)=>{
            if(err){
                result(err,{status:"failure",message:err,data:{}});
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}



module.exports = BusinessPhotoModel;