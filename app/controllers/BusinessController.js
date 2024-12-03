const BusinessMaster = require("../models/businessMasterModel.js");


exports.create = (req,res)=>{
   
    const model = new BusinessMaster({
        name:req.body.name,
        description:req.body.description,
        uid:req.body.uid,
    });

    BusinessMaster.create(model,(err,data)=>{
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


exports.getAll = (req,res)=>{
   
   

    BusinessMaster.getAll(req.body.uid,(err,data)=>{
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


exports.deleteBusiness = (req,res)=>{
   
   

    BusinessMaster.deleteBusiness(req.body.uid,req.body.bid,(err,data)=>{
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

