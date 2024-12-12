const sql = require('../models/db.js');
const Logger = require('./logger.js');

const Auth = function(model){}

Auth.ValidateAPIKey = (userid,accesstoken,result)=>{

 

  _getAPIKey(userid).then((data)=>{
    console.log(accesstoken);
    
    if(data.length > 0){

      console.log(data[0]['token']);
      
        if(accesstoken === data[0]['token']){
          result(true,{status:"success",message:"Access Token Validated"})
        }else{
          result(false,{status:"failure",message:"Invalid Acccess Token"})
        }
    }
  }).catch((Err)=>{
    console.log("Token Auth Failed "+Err);
    result(false,{status:"failure",message:"Invalid Acccess Token"})
    
  })


}


function _getAPIKey(userid){
  console.log(userid);
  
  return new Promise((resolve,reject)=>{
      sql.query("SELECT * FROM access_token_master WHERE userid = ? ORDER BY tokenid DESC LIMIT 1",[userid],(err,data)=>{
          if(err){
              console.log("Token Fetch Failed : "+err);
              reject(err);
              return;
          }
         console.log("Token Fetched Successfully");
         resolve(data);
  
         
          
      })
  })
}



module.exports = Auth;