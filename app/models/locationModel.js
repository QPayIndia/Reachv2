const { json } = require('express');
const sql = require('./db.js');

const LocationInfo = function(model){
    this.uid = model.uid,
    this.locationid = model.locationid,
    this.doorno = model.doorno,
    this.streetname = model.streetname,
    this.landmark = model.landmark,
    this.city = model.city,
    this.postalcode = model.postalcode,
    this.area = model.area,
    this.state = model.state,
    this.country = model.country,
    this.coordinates = model.coordinates,
    this.latitude = model.latitude,
    this.longitude = model.longitude,
    this.createdby = model.createdby
    // this.createdon = model.createdon
}



LocationInfo.create = (model,result)=>{
   
    getLocationData(model.uid).then((data)=>{
        if(data.length > 0){
            console.log("Info Already present")
            updateInfo(model).then((id)=>{
                result(null,{status:"success",message:"Location Info Updated Successfully",data:id});
            }).catch(({
        
            }));
        }else{
            addLocationInfo(model).then((id)=>{
                result(null,{status:"success",message:"Location Info Inserted Successfully",data:id});
            }).catch(({
        
            }));
        }
    })
    
    
    
}

function addLocationInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO location_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Location Info Failed due to '+err);
                    return;
                }
                console.log('Location Info Inserted successfully');
                resolve(res.insertId);
            })
    });
}

function updateInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE location_master SET ? WHERE uid = ?",[model,model.uid],(err,res)=>{
                if(err){
                    
                    console.log('Location Info Failed due to '+err);
                    return;
                }
                console.log('Location Info Updated successfully');
                resolve(res.insertId);
            })
    });
}



LocationInfo.getLocationData = (uid,result)=>{
    
    getLocationData(uid).then((data)=>{
        result(null,{status:"success",message:"Location Info Fetched Successfully",data:data[0]});
    })

    
}

function getLocationData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM location_master WHERE uid = ? LIMIT 1",[uid],(err,data)=>{
            if(err){
                result(err,{status:"failure",message:err,data:{}});
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}



module.exports = LocationInfo;