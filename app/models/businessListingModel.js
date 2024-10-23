const sql = require('./db.js');

const BusinessListing = function(model){
    this.uid = model.uid,
    this.search = model.search,
    this.sort = model.sort,
    this.rating = model.rating,
    this.categoryid = model.categoryid,
    this.subcategoryid = model.subcategoryid,
    this.latitude = model.latitude,
    this.longitude = model.longitude,
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

        var categoryQuery = (model.categoryid == 0) ? "" : ' AND categoryid = '+model.categoryid;
        
        categoryQuery +=(model.subcategoryid == 0) ? "" : ' AND subcategoryid = '+model.subcategoryid;
        console.log(categoryQuery);
        var query = "SELECT DISTINCT business_info.uid as bid,business_info.name,streetname,whatsapp,phone,business_info.profile as thumb,D.totalRating as rating,D.reviewCount as review,CASE WHEN F.bfavid IS NOT NULL THEN 1 ELSE 0 END AS liked FROM business_info,location_master,contact_info,business_photo_master,business_master as D LEFT JOIN `business_favourite_master` as F ON D.bid = F.bid AND F.userid = "+model.uid+" WHERE business_info.name LIKE '"+model.search+"%' AND D.bid = business_info.uid AND D.active = 1 AND  location_master.uid = business_info.uid AND contact_info.uid = business_info.uid AND business_info.uid = business_photo_master.uid AND location_master.areaid = "+model.districtid+categoryQuery+";";
        if(model.sort == "rating"){
            query = "SELECT DISTINCT business_info.uid as bid,business_info.name,streetname,whatsapp,phone,business_info.profile as thumb,D.totalRating as rating,D.reviewCount as review,CASE WHEN F.bfavid IS NOT NULL THEN 1 ELSE 0 END AS liked FROM business_info,location_master,contact_info,business_photo_master,business_master as D LEFT JOIN `business_favourite_master` as F ON D.bid = F.bid AND F.userid = "+model.uid+" WHERE business_info.name LIKE '"+model.search+"%' AND D.bid = business_info.uid AND D.active = 1  AND location_master.uid = business_info.uid AND contact_info.uid = business_info.uid AND business_info.uid = business_photo_master.uid AND location_master.areaid = "+model.districtid+categoryQuery+" ORDER BY D.totalRating/D.reviewCount DESC;";
        }else if (model.sort == "popular"){
            query = "SELECT DISTINCT business_info.uid as bid,business_info.name,streetname,whatsapp,phone,business_info.profile as thumb,D.totalRating as rating,D.reviewCount as review,CASE WHEN F.bfavid IS NOT NULL THEN 1 ELSE 0 END AS liked FROM business_info,location_master,contact_info,business_photo_master,business_master as D LEFT JOIN `business_favourite_master` as F ON D.bid = F.bid AND F.userid = "+model.uid+" WHERE business_info.name LIKE '"+model.search+"%' AND D.bid = business_info.uid AND D.active = 1 AND location_master.uid = business_info.uid AND contact_info.uid = business_info.uid AND business_info.uid = business_photo_master.uid AND location_master.areaid = "+model.districtid+categoryQuery+" ORDER BY D.reviewCount DESC;";
        }
        if (model.sort == "distance"){
            query = "SELECT DISTINCT business_info.uid as bid,business_info.name,location_master.latitude,location_master.longitude,streetname,whatsapp,phone,business_info.profile as thumb,D.totalRating as rating,D.reviewCount as review,CASE WHEN F.bfavid IS NOT NULL THEN 1 ELSE 0 END AS liked FROM business_info,location_master,contact_info,business_photo_master,business_master as D LEFT JOIN `business_favourite_master` as F ON D.bid = F.bid AND F.userid = "+model.uid+" WHERE business_info.name LIKE '"+model.search+"%' AND D.bid = business_info.uid AND D.active = 1 AND  location_master.uid = business_info.uid AND contact_info.uid = business_info.uid AND business_info.uid = business_photo_master.uid AND location_master.areaid = "+model.districtid+categoryQuery+"  ORDER BY D.reviewCount DESC;";

        }
        if (model.rating != ""){
            query = "SELECT DISTINCT business_info.uid as bid,business_info.name,streetname,whatsapp,phone,business_info.profile as thumb,D.totalRating as rating,D.reviewCount as review,CASE WHEN F.bfavid IS NOT NULL THEN 1 ELSE 0 END AS liked FROM business_info,location_master,contact_info,business_photo_master,business_master as D LEFT JOIN `business_favourite_master` as F ON D.bid = F.bid AND F.userid = "+model.uid+" WHERE business_info.name LIKE '"+model.search+"%' AND D.bid = business_info.uid AND D.active = 1 AND  location_master.uid = business_info.uid AND contact_info.uid = business_info.uid AND business_info.uid = business_photo_master.uid AND location_master.areaid = "+model.districtid+categoryQuery+" AND D.totalRating/D.reviewCount = "+model.rating+" ORDER BY D.reviewCount DESC;";

        }

        console.log(query);
        
        
        sql.query(query,(err,res)=>{
            if(err){
                
                console.log('Business Listing Failed '+err+'\n'+model);
                reject(err);
                return;
            }
            console.log('Business Listing Fetched successfully :'+model);
            let data = [];
            for(let i=0;i< res.length; i++){
                let js = res[i];
                res[i]['thumb'] = "http://ec2-3-108-62-163.ap-south-1.compute.amazonaws.com:8080"+    res[i]['thumb'];
                res[i]['liked'] = res[i]['liked'] === 1 ? true : false;
                if(res[i]['rating'] > 0){
                    let rating = res[i]['rating'] / res[i]['review'];
                    res[i]['rating'] = rating.toFixed(1);
                }else{
                    res[i]['rating'] = "0";
                }
                js.distance = (model.latitude === 0 && model.longitude === 0) ?'' : distance(model.latitude,model.longitude,js.latitude,js.longitude,'K').toFixed(1);
                data[i] = js;
                // res[i]['review'] = 0;
            }
            if(model.sort == 'distance')data.sort((a, b) => a.distance - b.distance);
            resolve(data);
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


function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist;
    }
}



module.exports = BusinessListing;