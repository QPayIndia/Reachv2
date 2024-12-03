const BillPayments = require("../models/billPaymentsModel");
const RequestValidator = require("../utils/requestValidator");



exports.getPrepaidPlans = (req,res)=>{
    if(!req.body){
        res.status(400).send({
            status:"failure",
            message:"Content cannot be Empty"
        });
    }

    
   

    BillPayments.getPrepaidPlans(req.body.userid,req.body.billerid,req.body.circle,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    });

   
};

exports.getBillDetails = (req,res)=>{
    if(!req.body){
        res.status(400).send({
            status:"failure",
            message:"Content cannot be Empty"
        });
    }

    RequestValidator.validateRequest(req,res,["operator","billnumber"],(auth)=>{
        if(auth){
            BillPayments.getBillDetails(req.body.operator,req.body.billnumber,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else
                    res.status(200).send(data);
            });
        }
    })

    
   

    

   
};


