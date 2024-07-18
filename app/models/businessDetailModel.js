const sql = require('./db.js');

const BusinessDetail = function(model){
    this.uid = model.uid
    // this.search = model.search,
    // this.stateid = model.stateid,
    // this.districtid = model.districtid
    
    
}

BusinessDetail.getDetail = (model,result)=>{
   
    getDetailFun(model).then((data)=>{
        getSocialMedia(model.uid).then((socialData)=>{
            getBusinessHour(model.uid).then((timing)=>{
                getImage(model.uid).then((image)=>{
                    result(null,{status:"success",message:"Business Detail Fetched successfully ",data:data,social:socialData,businessTiming:timing,images:image});
                })            })       
         })
       
    }).catch((err)=>{
        result(err,{status:"failure",message:err});
    })
}



function getDetailFun(model){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.name,A.category,A.est,B.streetname,C.phone,C.whatsapp FROM business_info as A,location_master as B,contact_info as C WHERE A.uid = ? AND A.uid = B.uid AND A.uid = C.uid;;",[model.uid],(err,res)=>{
            if(err){
                
                console.log('Business Detail Failed '+err+'\n'+model);
                reject();
                return;
            }
            console.log('Business Detail Fetched successfully :'+model);
            for(let i=0;i< res.length; i++){
                res[i]['rating'] = 0;
                res[i]['review'] = 0;
            }
            resolve(res);
        })
    })
}
function getSocialMedia(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT website,instagram,facebook,youtube,twitter FROM social_media WHERE uid = ?",[uid],(err,res)=>{
            if(err){
                
                console.log('Social Media Fail due to '+err);
                reject();
                return;
            }
            console.log('Social Media Fetched successfully');
            resolve(res[0]);
        })
    })
}
function getImage(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM business_photo_master WHERE uid = ?",[uid],(err,res)=>{
            if(err){
                
                console.log('Media Fail due to '+err);
                reject();
                return;
            }
            console.log(' Media Fetched successfully');
            resolve(res[0]);
        })
    })
}

function getBusinessHour(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT *  FROM business_timings WHERE uid = ?",[uid],(err,res)=>{
            if(err){
                
                console.log('Business Timings Fail due to '+err);
                reject();
                return;
            }
            console.log('Business Timings Fetched successfully');
            resolve(res[0]);
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






module.exports = BusinessDetail;