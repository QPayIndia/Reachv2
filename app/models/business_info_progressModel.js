const { json } = require('express');
const sql = require('./db.js');

const BusinessInfoProgress = function(model){
    this.uid = model.uid
    //this.contactid = model.contactid,
    
}




BusinessInfoProgress.getData = (uid,result)=>{
    
getData(uid).then((data)=>{
	result(null,{status:"success",message:"Business Info Progress Fetched Successfully",data:data[0]});
});
   

    

    
   
}

function getData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT ( SELECT COUNT(*)  FROM contact_info WHERE uid = ?) as contactid,(  SELECT COUNT(*) FROM business_info WHERE uid = ?)as binfoid,( SELECT COUNT(*) FROM location_master WHERE uid = ?) as locationid,( SELECT COUNT(*) FROM payment_info_master WHERE uid = ?) as pinfoid,( SELECT COUNT(*) FROM kyc_master WHERE uid = ?) as kycid,( SELECT COUNT(*) FROM business_kyc WHERE uid = ?) as bkycid,( SELECT COUNT(*) FROM business_photo_master WHERE uid = ?) as photoid,( SELECT COUNT(*) FROM social_media WHERE uid = ?) as socialid,"+
"( SELECT COUNT(*) FROM award_master WHERE uid = ?)+ ( SELECT COUNT(*) FROM certificate_master WHERE uid = ?) as awardid,( SELECT COUNT(*) FROM trade_member_master WHERE uid = ?) as tradeid,"+
"( SELECT COUNT(*) FROM product_master WHERE uid = ?) + ( SELECT COUNT(*) FROM service_master WHERE uid = ?) + ( SELECT COUNT(*) FROM brochure_master WHERE uid = ?) as productid;",[uid,uid,uid,uid,uid,uid,uid,uid,uid,uid,uid,uid,uid,uid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Business Info Progress Failed due to '+err);
                    return;
                }
                console.log('Business Info Fetched successfully');
				
				let progress = 0;
				progress = ((data[0]["contactid"] > 0) ? 5 :0)+ ((data[0]["binfoid"] > 0) ? 5 : 0)+ ((data[0]["locationid"] > 0) ? 10 : 0)+ ((data[0]["pinfoid"] > 0) ? 10 : 0)+ ((data[0]["kycid"] > 0) ? 10 : 0)+ ((data[0]["bkycid"] > 0) ? 10 : 0)+ ((data[0]["photoid"] > 0) ? 10 : 0)+ ((data[0]["socialid"] > 0) ? 10 : 0)+ ((data[0]["awardid"] > 0) ? 10 : 0)+ ((data[0]["tradeid"] > 0) ? 10 : 0)+ ((data[0]["productid"] > 0) ? 10 : 0);
				data[0]['progress'] = progress;
				data[0]["contactid"] = (data[0]["contactid"] > 0) ? true : false;
				data[0][ "binfoid"] =(data[0]["binfoid"] > 0) ? true : false;
				data[0]["locationid"] = (data[0]["locationid"] > 0) ? true : false;
				data[0]["pinfoid"] = (data[0]["pinfoid"] > 0) ? true : false;
				data[0]["kycid"] = (data[0]["kycid"] > 0) ? true : false;
				data[0]["bkycid"] = (data[0]["bkycid"] > 0) ? true : false;
				data[0]["photoid"] = (data[0]["photoid"] > 0) ? true : false;
				data[0][ "socialid"] =(data[0]["socialid"] > 0) ? true : false;
				data[0][ "awardid"] = (data[0]["awardid"] > 0) ? true : false;
				data[0][ "tradeid"] = (data[0]["tradeid"] > 0) ? true : false;
				data[0][ "productid"] = (data[0]["productid"] > 0) ? true : false;

                resolve(data);
            })
    });
}





module.exports = BusinessInfoProgress;