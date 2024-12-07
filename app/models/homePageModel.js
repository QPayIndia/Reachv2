const { json } = require('express');
const sql = require('./db.js');

const HomePageModel = function(model){
   
    
}





HomePageModel.getRentalProducts = (areaid,result)=>{
    
    _getRentalProducts(areaid).then((data)=>{
       
            result(null,{status:"success",message:"Data Fetched Successfully",data:data});
      
    }).catch((err)=>{
        result(err,{status:"failure",message:"Something went wrong",data:[]});
    })

    
}
HomePageModel.getManPower = (areaid,result)=>{
    
    _getManPower(areaid).then((data)=>{
       
            result(null,{status:"success",message:"Data Fetched Successfully",data:data});
      
    }).catch((err)=>{
        result(err,{status:"failure",message:"Something went wrong",data:[]});
    })

    
}



function _getRentalProducts(areaid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.productid,A.uid,A.productimg,A.name,A.brandname,A.pricetype,A.price,A.minprice,A.maxprice,A.minqty,A.maxqty,A.totalRating,A.reviewCount,A.rentFlag,A.active,B.whatsapp,C.name as businessName,B.phone as businessPhone FROM product_master as A,contact_info as B,business_info as C,location_master as D WHERE A.rentFlag = 1 AND A.uid = B.uid AND A.uid = C.uid AND A.uid = D.uid AND D.areaid = ? AND business_master.bid = A.bid AND business_master.active = 1 order by A.productid DESC;",areaid,(err,data)=>{
            if(err){
                resolve([]);
                console.log("Get Product Data :"+err);
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}

function _getManPower(areaid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT A.manreqid,A.bid,A.title,A.jobtype,A.description,A.skill,A.qualification,A.experience,A.agefrom,A.ageto,A.salaryfrom,A.salaryto,A.gender,A.employementtype,A.noofvacancies,A.startdate,A.enddate,C.name as businessName,C.profile as businessProfile, D.phone as businessPhone FROM manpower_req_master as A ,location_master as B , business_info as C, contact_info as D WHERE A.bid = B.uid AND A.bid = C.uid AND A.bid = D.uid AND B.areaid = ? AND business_master.bid = A.bid AND business_master.active = 1 order by A.manreqid DESC;",[areaid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Manpower Req Fetch Failed due to '+err);
                    return;
                }
                console.log('Manpower Req Fetched successfully');
				
			
                resolve(data);
            })
    });
}







module.exports = HomePageModel;