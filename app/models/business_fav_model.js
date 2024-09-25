const { json } = require('express');
const sql = require('./db.js');

const BusinessFavouriteModel = function(model){
    this.userid = model.userid,
    this.bid=model.bid
  

}



BusinessFavouriteModel.updateFavourite = (model,result)=>{
    
   
    getLike(model).then((data)=>{
       if(data.length > 0){
        deleteLike(model).then(()=>{
            result(null,{status:"success",message:"Favourite Removed Successfully"});
        }).catch((err)=>{
            result(err,{status:"failure",message:err});
         })
       }else{
        addLike(model).then(()=>{
            result(null,{status:"success",message:"Favourite added Successfully"});
        }).catch((err)=>{
            result(err,{status:"failure",message:err});
         })
       }
    }).catch((err)=>{
        result(err,{status:"failure",message:err});
  
    
})
}


BusinessFavouriteModel.getFavBusiness = (uid,result)=>{
   
    _getFavBusiness(uid).then((data)=>{
        result(null,{status:"success",message:"Business Listing Fetched successfully ",data:data});
    }).catch((err)=>{
        result(err,{status:"failure",message:err});
    })
}



function addLike(model){
    return new Promise((resolve,reject)=> {
        const query = 'INSERT INTO business_favourite_master SET userid = ?,bid = ?;';
        sql.query(query, [model.userid,model.bid], (err, res) => {
            if(err){
                reject(err);
                console.log('Like Insert Failed due to '+err);
                return;
            }
            console.log('Like Inserted successfully');
            resolve();
        });
    });
  }
  function deleteLike(model){
    return new Promise((resolve,reject)=> {
        const query = 'DELETE FROM business_favourite_master WHERE userid = ? AND bid = ?;';
        sql.query(query, [model.userid,model.bid], (err, res) => {
            if(err){
                reject(err);
                console.log('Like Delete Failed due to '+err);
                return;
            }
            console.log('Like Deleted successfully');
            resolve();
        });
    });
  }
  function getLike(model){
    return new Promise((resolve,reject)=> {
        const query = 'SELECT * FROM business_favourite_master WHERE userid = ? AND bid = ?;';
        sql.query(query, [model.userid,model.bid], (err, res) => {
            if(err){
                reject(err);
                console.log('Like Delete Failed due to '+err);
                return;
            }
            console.log('Like Deleted successfully');
            resolve(res);
        });
    });
  }


  function _getFavBusiness(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT DISTINCT business_info.uid as bid,business_info.name,streetname,whatsapp,phone,p1 as thumb,D.totalRating as rating,D.reviewCount as review FROM business_info,location_master,contact_info,business_photo_master,business_master as D ,business_favourite_master as F WHERE F.userid = ? AND F.bid = D.bid AND F.bid = business_info.uid AND F.bid = contact_info.uid AND F.bid = business_photo_master.uid AND F.bid = location_master.uid;",[uid],(err,res)=>{
            if(err){
                
                console.log('Business Data Fetch Fail due to '+err);
                reject();
                return;
            }
            console.log('Business Data Fetched successfully');
            for(let i=0;i< res.length; i++){
                // res[i]['thumb'] = "http://ec2-3-108-62-163.ap-south-1.compute.amazonaws.com:8080"+    res[i]['thumb'];
               
                if(res[i]['rating'] > 0){
                    let rating = res[i]['rating'] / res[i]['review'];
                    res[i]['rating'] = rating.toFixed(1);
                }else{
                    res[i]['rating'] = "0";
                }
                // res[i]['review'] = 0;
            }
            resolve(res);
        })
    })
}



module.exports = BusinessFavouriteModel;