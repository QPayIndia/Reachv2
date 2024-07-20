const ProductDetail = require("../models/productdetailModel.js");


exports.getDetail = (req,res)=>{
   
    const model = new ProductDetail({
        productid : req.body.productid,
        userid : req.body.userid,
        type : req.body.type
        
    });

    ProductDetail.getDetail(model,(err,data)=>{
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
   
    ProductDetail.addRating([req.body.productid,req.body.userid,req.body.rating,req.body.review,req.body.type],(err,data)=>{
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



