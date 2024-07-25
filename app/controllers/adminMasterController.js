const adminModel = require("../models/adminMaster.js");


exports.getAllMerchants = (req,res)=>{
   
    

    adminModel.getAllMerchants(req.body.uid,(err,data)=>{
        if(err){
            res.status(500).send({
                message:
                  err.message || "Something went wrong."
              });
        }
        else
            res.status(200).send(data);
    });


    

   
};




