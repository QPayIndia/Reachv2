const sql = require('./db.js');

const BusinessListing = function(model){
    this.uid = model.uid,
    this.search = model.search,
    this.stateid = model.stateid,
    this.districtid = model.districtid
    
    
}

BusinessListing.getListing = (model,result)=>{
   
    getAll(model).then((data)=>{
        result(null,{status:"success",message:"Business Listing Fetched successfully ",data:data});
    }).catch((err)=>{
        result(err,{status:"failure",message:err});
    })
}



function getAll(model){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT DISTINCT business_info.name,streetname,phone,p1 as thumb FROM business_info,location_master,contact_info,business_photo_master WHERE business_info.name LIKE '"+model.search+"%' AND location_master.uid = business_info.uid AND contact_info.uid = business_info.uid AND business_info.uid = business_photo_master.uid AND location_master.areaid = ?;",[model.districtid],(err,res)=>{
            if(err){
                
                console.log('Business Listing Failed '+err+'\n'+model);
                reject();
                return;
            }
            console.log('Business Listing Fetched successfully :'+model);
            for(let i=0;i< res.length; i++){
                res[i]['thumb'] = "http://ec2-3-108-62-163.ap-south-1.compute.amazonaws.com"+    res[i]['thumb'];
                res[i]['rating'] = 0;
                res[i]['review'] = 0;
            }
            resolve(res);
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






module.exports = BusinessListing;