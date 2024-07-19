const BusinessDetail = require("../models/businessDetailModel.js");


exports.getDetail = (req,res)=>{
   
    const model = new BusinessDetail({
        uid:req.body.uid,
        
    });

    BusinessDetail.getDetail(model,(err,data)=>{
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

exports.addRating = (req,res)=>{
   
    BusinessDetail.addRating([req.body.uid,req.body.userid,req.body.rating,req.body.review],(err,data)=>{
        if(err){
            res.status(500).send({
                message:
                  err.message || "Something went wrong."
              });
        }
        else
            res.status(200).send(data);
    });
}



