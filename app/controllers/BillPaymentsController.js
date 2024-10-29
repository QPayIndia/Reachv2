const BillPayments = require("../models/billPaymentsModel");



exports.getPrepaidPlans = (req,res)=>{
    if(!req.body){
        res.status(400).send({
            status:"failure",
            message:"Content cannot be Empty"
        });
    }

    
   

    BillPayments.getPrepaidPlans(req.body.userid,req.body.billerid,req.body.circle,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    });

   
};


