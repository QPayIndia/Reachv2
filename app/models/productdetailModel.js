const sql = require('./db.js');

const ProductDetail = function(model){
    this.productid = model.productid,
    this.userid = model.userid,
    this.type = model.type
    // this.search = model.search,
    // this.stateid = model.stateid,
    // this.districtid = model.districtid

    
}


const ProductRatingModel = function(model){
    this.productid = model.productid,
    this.userid = model.userid,
    this.rating = model.rating,
    this.review = model.review

    
}
const ServiceRatingModel = function(model){
    this.serviceid = model.serviceid,
    this.userid = model.userid,
    this.rating = model.rating,
    this.review = model.review

    
}

ProductDetail.getDetail = (model,result)=>{

    if(model.type == "product"){
        getProductDetail(model).then((data)=>{
            // getSocialMedia(model.uid).then((socialData)=>{
            //     getBusinessHour(model.uid).then((timing)=>{
            //         getImage(model.uid).then((image)=>{
            //             getProducts(model.uid).then((products)=>{
            //                 getService(model.uid).then((services)=>{
            //                      getBrochure(model.uid).then((brochure)=>{
                                   getProductReview(model.productid).then((reviews)=>{
                                        result(null,{status:"success",message:"Product Detail Fetched successfully ",data:data,review:reviews});
    
                            })
            //                 })
                           
            //                 })
            //             })                })            
            //     })       
            //  })
           
        }).catch((err)=>{
            result(err,{status:"failure",message:err});
        })
    }else{
        getServiceDetail(model).then((data)=>{
            // getSocialMedia(model.uid).then((socialData)=>{
            //     getBusinessHour(model.uid).then((timing)=>{
            //         getImage(model.uid).then((image)=>{
            //             getProducts(model.uid).then((products)=>{
            //                 getService(model.uid).then((services)=>{
            //                      getBrochure(model.uid).then((brochure)=>{
                                  getServiceReview(model.productid).then((reviews)=>{
                                        result(null,{status:"success",message:"Service Detail Fetched successfully ",data:data,review:reviews});
    
                            })
            //                 })
                           
            //                 })
            //             })                })            
            //     })       
            //  })
           
        }).catch((err)=>{
            result(err,{status:"failure",message:err});
        })
    }
   
    
}

ProductDetail.addRating = ([productid,userid,rating,review,type],result)=>{
    

    if(type == "product"){
        const model = new ProductRatingModel({
            productid : productid,
            type:type,
            userid:userid,
            rating:rating,
            review:review
        });
        addProductRating(model).then((id)=>{
            result(null,{status:"success",message:"Rating  Inserted Successfully",data:id});
        }).catch((err)=>{
            result(null,{status:"failure",message:err});
        });
    }else{
        const model = new ServiceRatingModel({
            serviceid : productid,
            type:type,
            userid:userid,
            rating:rating,
            review:review
        });

        addServiceRating(model).then((id)=>{
            result(null,{status:"success",message:"Rating  Inserted Successfully",data:id});
        }).catch((err)=>{
            result(null,{status:"failure",message:err});
        });
    }

    
}



function getProductDetail(model){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT productid,name,description,productimg,category,brandname,origin,pricetype,price,offerprice,units,minprice,maxprice,minqty,maxqty FROM product_master WHERE productid = ?;",[model.productid],(err,res)=>{
            if(err){
                
                console.log('Product Detail Failed '+err+'\n'+model);
                reject();
                return;
            }
            console.log('Product Detail Fetched successfully :'+model);
            // for(let i=0;i< res.length; i++){
            //     res[i]['rating'] = 0;
            //     res[i]['review'] = 0;
            // }
            if(res[0]['productimg'] != null){
                res[0]['productimg'] ="http://ec2-3-108-62-163.ap-south-1.compute.amazonaws.com:8080"+ res[0]['productimg'];
            }
            
            resolve(res);
        })
    })
}

function getServiceDetail(model){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT serviceid,name,description,serviceimg,category,pricetype,price,minprice,maxprice FROM service_master WHERE serviceid = ?;",[model.productid],(err,res)=>{
            if(err){
                
                console.log('Service Detail Failed '+err+'\n'+model);
                reject();
                return;
            }
            console.log('Service Detail Fetched successfully :'+model);
            // for(let i=0;i< res.length; i++){
            //     res[i]['rating'] = 0;
            //     res[i]['review'] = 0;
            // }
            if(res[0]['serviceimg'] != null){
                res[0]['serviceimg'] ="http://ec2-3-108-62-163.ap-south-1.compute.amazonaws.com:8080"+ res[0]['serviceimg'];
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
function getServiceReview(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.name,B.rating,B.review,B.createdon FROM user_master as A,service_rating_master as B WHERE B.userid = A.uid AND B.serviceid = ? LIMIT 20",[uid],(err,res)=>{
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

function getProductReview(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.name,B.rating,B.review,B.createdon FROM user_master as A,product_rating_master as B WHERE B.userid = A.uid AND B.productid = ? LIMIT 20",[uid],(err,res)=>{
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
function addProductRating(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO product_rating_master SET ?",[model],(err,res)=>{
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

function addServiceRating(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO  service_rating_master SET ?",[model],(err,res)=>{
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






module.exports = ProductDetail;