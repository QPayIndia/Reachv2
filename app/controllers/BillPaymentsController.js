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
            const amount = req.body.amount != null ? req.body.amount : 10;
            const mobile = req.body.mobilenumber != null ? req.body.mobilenumber : "";
            BillPayments.getBillDetails(req.body.operator,req.body.billnumber,mobile,amount,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else
                    res.status(200).send(data);
            });
        }
    })

    
   

    

   
};

exports.Checkout = (req,res)=>{
  

    RequestValidator.validateRequest(req,res,["amount"],(auth)=>{
        if(auth){
            BillPayments.getCheckoutTotal(req.body.amount,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else
                    res.status(200).send(data);
            });
        }
    })
};

exports.PayCreditCard = (req,res)=>{
  

    RequestValidator.validateRequest(req,res,["cardnumber"],(auth)=>{
        if(auth){
            BillPayments.PayCreditCard(req.body.cardnumber,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else
                    res.status(200).send(data);
            });
        }
    })
};

exports.getLoanProviders = (req,res)=>{
  
            
    RequestValidator.validateRequest(req,res,["page"],(auth)=>{
        if(auth){
            BillPayments.getLoanProviders(req.body.page,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else
                    res.status(200).send(data);
            });
    }})
        
    
};


exports.getProviders = (req,res)=>{
  
            
    RequestValidator.validateRequest(req,res,["page","categorykey"],(auth)=>{
        if(auth){
            BillPayments.getProviders(req.body.page,req.body.categorykey,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else
                    res.status(200).send(data);
            });
    }})
        
    
};


exports.getRechargePlans = (req,res)=>{
  
            
    RequestValidator.validateRequest(req,res,["circle","operator"],(auth)=>{
        if(auth){
            BillPayments.getRechargePlans(req.body.circle,req.body.operator,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else
                    res.status(200).send(data);
            });
    }})
        
    
};

exports.getCreditCardProviders = (req,res)=>{
  
            
    RequestValidator.validateRequest(req,res,["page"],(auth)=>{
        if(auth){
            BillPayments.getCreditCardProviders(req.body.page,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else
                    res.status(200).send(data);
            });
    }})
        
    
};

exports.ValidateCard = (req,res)=>{
  
            
    RequestValidator.validateRequest(req,res,["binNumber"],(auth)=>{
        if(auth){
            BillPayments.validateCard(req.body.binNumber,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else
                    res.status(200).send(data);
            });
    }})
        
    
};


exports.initTransaction = (req,res)=>{
   

    const BillInitModel = function(model){
        this.userid = model.userid,
        this.billtype = model.billtype,
        this.billername = model.billername,
        this.billerid = model.billerid,
        this.enquiryid = model.enquiryid,
        this.billnumber = model.billnumber,
        this.mobilenumber = model.mobilenumber,
        this.telecomcircle = model.telecomcircle,
        this.amount = model.amount,
        this.billamount = model.billamount,
        this.createdby = model.createdby
        
       
    }

   

    RequestValidator.validateRequest(req,res,["userid","billtype","billername","billerid","billnumber","mobilenumber","amount","telecomcircle"],(auth)=>{
        if(auth){
            let telecomCircle = req.body.telecomcircle;
            let model = new BillInitModel({
                userid : req.body.userid,
                billtype : req.body.billtype,
                billername : req.body.billername,
                billerid : req.body.billerid,
                enquiryid : req.body.enquiryid,
                billnumber : req.body.billnumber,
                mobilenumber : req.body.mobilenumber,
                telecomcircle : (req.body.billtype === "DTH") ? "TN" :telecomCircle,
                amount : req.body.amount,
                billamount:req.body.billamount,
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

exports.GetOperatorDetails = (req,res)=>{
    
    RequestValidator.validateRequest(req,res,["operator"],(auth)=>{
        if(auth){
            BillPayments.GetOperatorDetails(req.body.operator,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else
                    res.status(200).send(data);
            });
        }
    }) 
};


