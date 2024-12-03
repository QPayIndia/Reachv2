const BusinessReports = require("../models/businessReports");



exports.getReports = (req,res)=>{
    if(!req.body){
        res.status(400).send({
            message:"Content cannot be Empty"
        });
    }

    
    
    BusinessReports.getReports(req.body.bid,req.body.type,req.body.status,req.body.fromdate,req.body.todate,(err,data)=>{
        if(err){
            res.status(400).send({
                message:
                  err.message || "Something went wrong."
              });
        }
        else
            res.status(200).send(data);
    });

   
};
