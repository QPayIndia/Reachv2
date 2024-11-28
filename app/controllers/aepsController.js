const TransactionModel = require("../models/TransactionModel");
const sql = require('../models/db.js');

exports.InitAEPS = (req,res)=>{
    const axios = require('axios');
    const mobileUserAgent = 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36';
   
    _getReachId(req.body.userid).then((data)=>{
      
      
      if(data.length > 0){
        axios.get('https://pg.qpayindia.com/reach/aepsservice?userid='+data[0]['reachid'],{
          headers: {
              'User-Agent': mobileUserAgent,
            },
      })
        .then((response) => {
          res.status(200).send(response.data);
        })
        .catch((error) => {
          console.error(`An error occurred: ${error.message}`);
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 Not Found</h1>');
        });
      }else{
        
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 Not Found</h1>');
      }
    }).catch((error)=>{
      console.error(`An error occurred: ${error.message}`);
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 Not Found</h1>');
    });
    
    
}






function _getReachId(userid){
  return new Promise((resolve,reject)=>{
      sql.query("SELECT * FROM aeps_map_master WHERE userid = ?",[userid],(err,data)=>{
          if(err){
              console.log("Get AEPS ID  Failed : "+err);
              reject(err);
              return;
          }
         console.log("AEPS ID Fetched Successfully");
         
         resolve(data);
  
         
          
      })
  })
}



