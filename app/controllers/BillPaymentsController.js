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

exports.initTransaction = (req,res)=>{
   

    const BillInitModel = function(model){
        this.userid = model.userid,
        this.billtype = model.billtype,
        this.billername = model.billername,
        this.billerid = model.billerid,
        this.billnumber = model.billnumber,
        this.mobilenumber = model.mobilenumber,
        this.amount = model.amount,
        this.createdby = model.createdby
        
       
    }

   

    RequestValidator.validateRequest(req,res,["userid","billtype","billername","billerid","billnumber","mobilenumber","amount"],(auth)=>{
        if(auth){

            let model = new BillInitModel({
                userid : req.body.userid,
                billtype : req.body.billtype,
                billername : req.body.billername,
                billerid : req.body.billerid,
                billnumber : req.body.billnumber,
                mobilenumber : req.body.mobilenumber,
                amount : req.body.amount,
                createdby : req.body.userid
            })

            BillPayments.initTransaction(model,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else
                    res.status(200).send(data);
            });
        }
    })
};

exports.getOperators = (req,res)=>{
    
    RequestValidator.validateRequest(req,res,["type"],(auth)=>{
        if(auth){
            BillPayments.getOperators(req.body.type,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else
                    res.status(200).send(data);
            });
        }
    }) 
};


