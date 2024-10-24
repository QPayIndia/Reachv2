const { JSON } = require('mysql/lib/protocol/constants/types.js');
const globals = require('../config/globals.js');
const controller = require('../controllers/businessInfoController.js');
const sql = require('./db.js');
const BusinessMaster = require('./businessMasterModel.js');
const Socket = require('../utils/socket.js');

const BusinessDetail = function(model){
    this.uid = model.uid,
    this.userid = model.userid
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
                                getReviews(model.uid).then((reviews)=>{
                                    getBusinessRating(model).then((userReview)=>{
                                        let userRating = {"rating":0,review:""};
                                        if(userReview.length > 0){
                                            userRating = {"rating":userReview[0]['rating'],review:userReview[0]['review']}
                                        }
                                        getFAQ(model.uid).then((faq)=>{
                                            result(null,{status:"success",message:"Business Detail Fetched successfully ",data:data,userRating:userRating,social:socialData,businessTiming:timing,images:image,product:products,service:services,brochure:brochure,review:reviews,faq:faq});

                        })
                        })
                        })
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

    getBusinessRating(model).then((data)=>{
        if(data.length > 0){
            updateBusinessRating(model).then((id)=>{
                result(null,{status:"success",message:"Rating  Updated Successfully"});
            }).catch((err)=>{
                result(null,{status:"failure",message:err});
            });
        }else{
            addRating(model).then((id)=>{
                BusinessMaster.getUserIdByBID(model.uid,(err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                      if(data['userid']!= null)  Socket.SendMessageByUserId(data.userid,'rating',JSON.stringify({bid:model.uid,userid:data.userid,message:'Your Business Got A New Review!'}),"","","");
                    }
                })
                result(null,{status:"success",message:"Rating  Inserted Successfully",data:id});
            }).catch((err)=>{
                result(null,{status:"failure",message:err});
            });
        }
    })
}



function getDetailFun(model){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT DISTINCT A.name,E.p1 as profile,A.category,A.est,B.streetname,B.doorno,B.landmark,B.city,B.postalcode,B.area,B.state,B.latitude,B.longitude,C.phone,C.whatsapp,D.reviewCount as reviewCount,D.totalRating as totalRating  FROM business_info as A,location_master as B,contact_info as C,business_master as D,business_photo_master as E WHERE D.bid = ? AND D.bid = A.uid AND D.bid = B.uid AND D.bid = C.uid AND D.bid = E.uid;",[model.uid],(err,res)=>{
            if(err){
                
                console.log('Business Detail Failed '+err+'\n'+model);
                reject();
                return;
            }
            console.log('Business Detail Fetched successfully :'+model);
            // for(let i=0;i< res.length; i++){
            //     res[i]['rating'] = 0;
            //     res[i]['review'] = 0;
            // }
           if(res.length > 0){
            if(res[0]['totalRating'] != 0){
                let rating = res[0]['totalRating'] / res[0]['reviewCount'];
                res[0]['totalRating'] = rating.toFixed(1);
            }else{
                res[0]['totalRating'] = "0";
            }

            res[0]['userRating'] = 0;
            res[0]['userReview'] = "";
            res[0]['profile'] =  globals.domain+ res[0]['profile'];
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
function getFAQ(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT question,answer FROM faq_master WHERE bid = ?",[uid],(err,res)=>{
            if(err){
                
                console.log('FAQ Fetch Fail due to '+err);
                reject();
                return;
            }
            console.log('FAQ Fetched successfully');
            resolve(res);
        })
    })
}
function getReviews(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.name,B.rating,B.review,B.createdon FROM user_master as A,business_rating_master as B WHERE B.userid = A.uid AND B.uid = ? LIMIT 20",[uid],(err,res)=>{
            if(err){
                
                console.log('Review Fail due to '+err);
                reject();
                return;
            }
            console.log('Review Fetched successfully');
            resolve(res);
        })
    })
}
function getProducts(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT productid,name,price,productimg,totalRating as rating,reviewCount as review,pricetype,offerprice,minprice,maxprice,minqty,maxqty,rentFlag FROM product_master WHERE uid = ?",[uid],(err,res)=>{
            if(err){
                
                console.log('Product Fetch Fail due to '+err);
                reject();
                return;
            }
            for(let i=0;i< res.length; i++){
                res[i]['productimg'] = "http://ec2-3-108-62-163.ap-south-1.compute.amazonaws.com:8080"+  res[i]['productimg'];
                res[i]['rentFlag'] = res[i]['rentFlag'] === 0 ? false : true;
                if(res[i]['rating'] > 0){
                    let rating = res[i]['rating'] / res[i]['review'];
                    res[i]['rating'] = rating.toFixed(1);
                }else{
                    res[i]['rating'] = "0";
                }
            }
            console.log('Product Data Fetched successfully');
            resolve(res);
        })
    })
}

function getService(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT serviceid,name,price,serviceimg,totalRating as rating,reviewCount as review,pricetype,minprice,maxprice FROM service_master WHERE uid = ?",[uid],(err,res)=>{
            if(err){
                
                console.log('Service Fetch Fail due to '+err);
                reject();
                return;
            }
            for(let i=0;i< res.length; i++){
                res[i]['serviceimg'] = "http://ec2-3-108-62-163.ap-south-1.compute.amazonaws.com:8080"+  res[i]['serviceimg'];
                if(res[i]['rating'] > 0){
                    let rating = res[i]['rating'] / res[i]['review'];
                    res[i]['rating'] = rating.toFixed(1);
                }else{
                    res[i]['rating'] = "0";
                }
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

function getBusinessRating(model){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM business_rating_master WHERE uid = ? AND userid = ?",[model.uid,model.userid],(err,res)=>{
            if(err){
                
                console.log('Business Timings Fail due to '+err);
                reject();
                return;
            }
            console.log('Business Timings Fetched successfully');
            resolve(res);
        })
    })
}
function addRating(model){
    return new Promise((resolve,reject)=>{
        console.log(model)
        sql.query("INSERT INTO  business_rating_master SET ?;UPDATE business_master SET reviewCount = reviewCount + 1,totalRating = totalRating + ? WHERE bid = ?;",[model,model.rating,model.uid],(err,res)=>{
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
function updateBusinessRating(model){
    return new Promise((resolve,reject)=>{
        getBusinessRating(model).then((data)=>{
            sql.query("UPDATE business_rating_master SET rating = ?,review = ? WHERE uid = ? AND userid = ?;UPDATE business_master SET totalRating = totalRating - ? + ? WHERE bid = ?;",[model.rating,model.review,model.uid,model.userid,data[0]['rating'],model.rating,model.uid],(err,res)=>{
                if(err){
                    
                    console.log('Rating Update Fail due to '+err);
                    reject();
                    return;
                }
                console.log('Rating Updated successfully');
                resolve();
            })
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