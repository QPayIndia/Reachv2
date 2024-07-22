const BusinessListing = require("../models/businessListingModel.js");


exports.getListing = (req,res)=>{
   
    const model = new BusinessListing({
        uid:req.body.uid,
        search:req.body.search,
        sort:req.body.sort,
        rating:req.body.rating,
        stateid:req.body.stateid,
        districtid:req.body.districtid,
    });

    BusinessListing.getListing(model,(err,data)=>{
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



