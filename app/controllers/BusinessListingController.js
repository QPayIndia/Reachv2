const BusinessListing = require("../models/businessListingModel.js");


exports.getListing = (req,res)=>{
   
    const model = new BusinessListing({
        uid:req.body.uid,
        search:req.body.search,
        sort:req.body.sort,
        rating:req.body.rating,
        stateid:req.body.stateid,
        categoryid:req.body.categoryid,
        latitude: req.body.latitude || 0,
        longitude: req.body.longitude || 0,
        subcategoryid:req.body.subcategoryid,
        districtid:req.body.districtid,
    });
    console.log(model);
    
    BusinessListing.getListing(model,(err,data)=>{
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



