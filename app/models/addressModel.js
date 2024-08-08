const { json } = require('express');
const sql = require('./db.js');

const AddressModel = function(model){
    this.userid = model.userid,
    this.contactname = model.contactname,
    this.contactphone = model.contactphone,
    this.doorno = model.doorno,
    this.streetname = model.streetname,
    this.landmark = model.landmark,
    this.city = model.city,
    this.postalcode = model.postalcode,
    this.area = model.area,
    this.state = model.state,
    this.areaid = model.areaid,
    this.stateid = model.stateid,
    this.country = model.country
    
}



AddressModel.create = (model,addressid,result)=>{
   
   
        if(addressid > 0){
            
            updateInfo(model).then((id)=>{
                getLocationData(model.userid).then((data)=>{
                    result(null,{status:"success",message:"Location Info Updated Successfully",data:data});
                }).catch((err)=>{
                    result(null,{status:"success",message:"Location Info Updated Successfully",data:[]});
                })
                
            }).catch((err)=>{
                result(err,{status:"failure",message:"Location Info Update Failed"});
            });
        }else{
            addLocationInfo(model).then((id)=>{
                getLocationData(model.userid).then((data)=>{
                    result(null,{status:"success",message:"Location Info Inserted Successfully",data:data});
                }).catch((err)=>{
                    result(null,{status:"success",message:"Location Info Inserted Successfully",data:[]});
                })
                
            }).catch((err)=>{
                result(err,{status:"failure",message:"Location Info Insert Failed"});
            });
        }
   
    
    
    
}

function addLocationInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO address_master SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Location Info Failed due to '+err);
                    reject(err);
                    return;
                }
                console.log('Location Info Inserted successfully');
                resolve(res.insertId);
            })
    });
}

function updateInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE address_master SET ? WHERE userid = ?",[model,model.userid],(err,res)=>{
                if(err){
                    reject(err);
                    console.log('Location Info Failed due to '+err);
                    return;
                }
                console.log('Location Info Updated successfully');
                resolve(res.insertId);
            })
    });
}



AddressModel.getLocationData = (userid,result)=>{
    
    getLocationData(userid).then((data)=>{
        getState().then((state)=>{
            result(null,{status:"success",message:"Location Info Fetched Successfully",data:data,state:state});
        }).catch((err)=>{
            result(null,{status:"success",message:"Location Info Fetched Successfully",data:data,state:[]});
        })
    }).catch((err)=>{
        result(err,{status:"failure",message:"Location Info Fetched Successfully",data:[],state:[]});
    })

    
}


AddressModel.deleteData = (addressid,result)=>{
    
    getDataByID(addressid).then((data)=>{
		if(data.length > 0){
			deleteData(addressid).then(()=>{
				result(null,{status:"success",message:"Address Deleted Successfully"});
			}).catch((err)=>{
				result(err,{status:"failure",message:"Address Delete Failed"});
			});
			   
		}else{
			result(null,{status:"failure",message:"No Data Found"});
		}
	});
    
}


AddressModel.getDistricts = (stateid,result)=>{
    
    
        getDistricts(stateid).then((district)=>{
            result(null,{status:"success",message:"Districts Fetched Successfully",district:district});
        }).catch((err)=>{
            result(err,{status:"failure",message:"Districts Fetch Failed",district:[]});
        })
  

    
}

function getState(){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT state,stateid FROM state_master",(err,data)=>{
            if(err){
                console.log("Get State Master : "+err);
                reject(err);
                return;
            }

            resolve(data);

        })
    })
}


function getDistricts(stateid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT stateid,district,districtid FROM district_master WHERE stateid = ?",[stateid],(err,data)=>{
            if(err){
                console.log("Get District Master : "+err);
                reject(err);
                return;
            }

            resolve(data);

        })
    })
}

function getLocationData(userid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM address_master WHERE userid = ?",[userid],(err,data)=>{
            if(err){
                
                reject(err);
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}

function getDataByID(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM address_master WHERE addressid = ?",[uid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Address Fetch Failed due to '+err);
                    return;
                }
                console.log('Address Fetched successfully');
				
			
                resolve(data);
            })
    });
}

function deleteData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM address_master WHERE addressid = ?",[uid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Address Delete Failed due to '+err);
                    return;
                }
                console.log('Address Delete successfully');
                resolve();
            })
    });
}




module.exports = AddressModel;