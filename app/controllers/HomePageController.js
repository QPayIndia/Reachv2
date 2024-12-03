const HomePageModel = require("../models/homePageModel");


exports.getRentalProducts = (req,res)=>{
   
   
    HomePageModel.getRentalProducts(req.body.areaid,(err,data)=>{
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
exports.getManPower = (req,res)=>{
   
   
    HomePageModel.getManPower(req.body.areaid,(err,data)=>{
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



