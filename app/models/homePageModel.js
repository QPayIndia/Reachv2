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



function _getRentalProducts(){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM product_master WHERE rentFlag = 1",(err,data)=>{
            if(err){
                resolve([]);
                console.log("Get Product Data :"+err);
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}


module.exports = HomePageModel;