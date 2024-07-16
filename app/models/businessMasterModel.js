const sql = require('./db.js');

const BusinessMaster = function(model){
    this.name = model.name,
    this.description = model.description,
    this.uid = model.uid,
    this.createdby = model.uid
    
}

BusinessMaster.create = (model,result)=>{
   
    createBusiness(model).then((data)=>{
        result(null,{status:"success",message:"Business Created Successfully",bid:data});
    }).catch((err)=>{
        result(err,{status:"failure",message:err});
    })
}
BusinessMaster.getAll = (uid,result)=>{
   
    getAllBuiness(uid).then((data)=>{
        result(null,{status:"success",message:"Business Data Fetched Successfully",data:data});
    }).catch((err)=>{
        result(err,{status:"failure",message:err});
    })
}
BusinessMaster.deleteBusiness = (uid,bid,result)=>{
   
    deleteBusiness(uid,bid).then(()=>{
        result(null,{status:"success",message:"Business Deleted Successfully"});
    }).catch((err)=>{
        result(err,{status:"failure",message:err});
    })
}


function createBusiness(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO business_master SET ?",[model],(err,res)=>{
            if(err){
                
                console.log('Business Created Failer due to '+err);
                reject();
                return;
            }
            console.log('Business Created successfully');
            resolve(res.insertId);
        })
    })
}
function getAllBuiness(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT bid,name,description FROM business_master WHERE uid = ?",[uid],(err,res)=>{
            if(err){
                
                console.log('Business Data Fail due to '+err);
                reject();
                return;
            }
            console.log('Business Data Fetched successfully');
            resolve(res);
        })
    })
}
function deleteBusiness(uid,bid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM business_master WHERE uid = ? AND bid  = ?",[uid,bid],(err,res)=>{
            if(err){
                
                console.log('Business Data Fail due to '+err);
                reject();
                return;
            }
            console.log('Business Data Deleted successfully');
            resolve();
        })
    })
}






module.exports = BusinessMaster;