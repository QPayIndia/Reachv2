const { json } = require('express');
const sql = require('./db.js');

const HomePageModel = function(model){
   
    
}





HomePageModel.getRentalProducts = (userid,result)=>{
    
    _getRentalProducts().then((data)=>{
       
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



function _getRentalProducts(){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM product_master WHERE rentFlag = 1 order by productid DESC",(err,data)=>{
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
        sql.query("SELECT A.manreqid,A.bid,A.title,A.jobtype,A.description,A.skill,A.qualification,A.experience,A.agefrom,A.ageto,A.salaryfrom,A.salaryto,A.gender,A.employementtype,A.noofvacancies,A.startdate,A.enddate FROM manpower_req_master as A INNER JOIN location_master ON A.bid = location_master.uid AND location_master.areaid = ? order by A.manreqid DESC;",[areaid],(err,data)=>{
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