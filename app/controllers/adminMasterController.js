const adminModel = require("../models/adminMaster.js");


exports.getAllMerchants = (req,res)=>{
   
    

    adminModel.getAllMerchants(req.body.uid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    });
};
exports.getPendingMerchants = (req,res)=>{
   
    

    adminModel.getPendingMerchants(req.body.uid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    });
};
exports.getAllUsers = (req,res)=>{
   
    

    adminModel.getAllUsers(req.body.uid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    });
};
exports.updateMerchantActiveStatus = (req,res)=>{
   
    

    adminModel.updateMerchantActiveStatus(req.body.bid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    });
};




