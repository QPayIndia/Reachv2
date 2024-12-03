const BusinessDetail = require("../models/businessDetailModel.js");
const ReportModel = require("../models/reportModel.js");


exports.getDetail = (req,res)=>{
   
    const model = new BusinessDetail({
        uid:req.body.uid,
        userid : req.body.userid
        
    });

    BusinessDetail.getDetail(model,(err,data)=>{
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

exports.addReport = (req,res)=>{
   
    const model = new ReportModel({
        bid:req.body.bid,
        userid:req.body.userid,
        r1:req.body.r1,
        r1c:req.body.r1c,
        r2:req.body.r2,
        r2c:req.body.r2c,
        r3:req.body.r3,
        r3c:req.body.r3c,
        r4:req.body.r4,
        r4c:req.body.r4c
        
    });

    ReportModel.addData(model,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    });


    

   
};

exports.addRating = (req,res)=>{
   
    BusinessDetail.addRating([req.body.uid,req.body.userid,req.body.rating,req.body.review],(err,data)=>{
        if(err){
            res.status(400).send({
                message:
                  err.message || "Something went wrong."
              });
        }
        else
            res.status(200).send(data);
    });
}



