const sql = require('./db.js');

const BusinessDetail = function(model){
    this.uid = model.uid
    // this.search = model.search,
    // this.stateid = model.stateid,
    // this.districtid = model.districtid

    
}


const RatingModel = function(model){
    this.uid = model.uid,
    this.userid = model.userid,
    this.rating = model.rating,
    this.review = model.review

    
}

BusinessDetail.getDetail = (model,result)=>{
   
    getDetailFun(model).then((data)=>{
        getSocialMedia(model.uid).then((socialData)=>{
            getBusinessHour(model.uid).then((timing)=>{
                getImage(model.uid).then((image)=>{
                    getProducts(model.uid).then((products)=>{
                        getService(model.uid).then((services)=>{
                             getBrochure(model.uid).then((brochure)=>{
                                result(null,{status:"success",message:"Business Detail Fetched successfully ",data:data,social:socialData,businessTiming:timing,images:image,product:products,service:services,brochure:brochure});

                        })
                       
                        })
                    })                })            
            })       
         })
       
    }).catch((err)=>{
        result(err,{status:"failure",message:err});
    })
}

BusinessDetail.addRating = ([uid,userid,rating,review],result)=>{
    const model = new RatingModel({
        uid : uid,
        userid:userid,
        rating:rating,
        review:review
    });

    addRating(model).then((id)=>{
        result(null,{status:"success",message:"Rating  Inserted Successfully",data:id});
    }).catch((err)=>{
        result(null,{status:"failure",message:err});
    });
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
function getProducts(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT productid,name,price,productimg,pricetype,offerprice,minprice,maxprice FROM product_master WHERE uid = ?",[uid],(err,res)=>{
            if(err){
                
                console.log('Product Fetch Fail due to '+err);
                reject();
                return;
            }
            for(let i=0;i< res.length; i++){
                res[i]['productimg'] = "http://ec2-3-108-62-163.ap-south-1.compute.amazonaws.com:8080"+  res[i]['productimg'];
                
            }
            console.log('Product Data Fetched successfully');
            resolve(res);
        })
    })
}

function getService(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT serviceid,name,price,serviceimg,pricetype,minprice,maxprice FROM service_master WHERE uid = ?",[uid],(err,res)=>{
            if(err){
                
                console.log('Service Fetch Fail due to '+err);
                reject();
                return;
            }
            for(let i=0;i< res.length; i++){
                res[i]['serviceimg'] = "http://ec2-3-108-62-163.ap-south-1.compute.amazonaws.com:8080"+  res[i]['serviceimg'];
                
            }
            console.log('Service Data Fetched successfully');
            resolve(res);
        })
    })
}


function getBrochure(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT brochureid,name,brochureimg FROM brochure_master WHERE uid = ?",[uid],(err,res)=>{
            if(err){
                
                console.log('Service Fetch Fail due to '+err);
                reject();
                return;
            }
            for(let i=0;i< res.length; i++){
                res[i]['brochureimg'] = "http://ec2-3-108-62-163.ap-south-1.compute.amazonaws.com:8080"+  res[i]['brochureimg'];
                
            }
            console.log('Service Data Fetched successfully');
            resolve(res);
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
function addRating(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO  business_rating_master SET ?",[model],(err,res)=>{
            if(err){
                
                console.log('Rating Insert Fail due to '+err);
                reject();
                return;
            }
            console.log('Rating Inserted successfully');
            resolve(res.insertId);
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