const staffModel = require("../models/staffModel.js");
const multer = require('multer');
const path = require('path');
const BusinessMaster = require("../models/businessMasterModel.js");
const StaffModel = require("../models/staffModel.js");
const RequestValidator = require("../utils/requestValidator.js");


const BMap = function(model){
    this.bid = model.bid,
    this.staffid = model.staffid,
    this.followupid = model.followupid,
    this.status = model.status,
    this.createdby = model.createdby
}


exports.getAllBusiness = (req,res)=>{
   
    staffModel.getAllBusiness(req.body.userid,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    });
};

exports.UpdateBusinessStatus = (req,res)=>{
   
    RequestValidator.validateRequest(req,res,["bid","staffid","appdate","apptime","remarks","status"],(auth)=>{
        if(auth){

            const model = new BMap({
                bid:req.body.bid,
                staffid:req.body.userid,
                followupid:0,
                status:req.body.status,
                createdby:req.body.userid
            })

            staffModel.UpdateBusinessStatus(model,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else
                    res.status(200).send(data);
            });
        }
    });
};

exports.addUser = (req,res)=>{
    staffModel.addUser(req.body.phone,req.body.name,req.body.userid,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else{

            console.log(data);
            
            const model = new BusinessMaster({
                name:req.body.businessname,
                description:req.body.businessdescription,
                uid:data.uid,
                createdby:req.body.userid
            });
        
            BusinessMaster.create(model,(err,bdata)=>{
                if(err){
                    res.status(400).send({status:"failure",message:"User Created. Failed to create Business!"});
                }
                else{
                    const model = new BMap({
                        bid:bdata.bid,
                        staffid:req.body.userid,
                        followupid:0,
                        status:"PENDING",
                        createdby:req.body.userid
                    })

                    StaffModel.InsertBMap(model,(err,BMapData)=>{
                        if(err){
                            res.status(400).send({status:"failure",message:"Business Created. Failed to Map!"});
                        }
                        else
                            res.status(200).send(bdata);
                    })
                    
                }
                    
            });
        }
            
    });
};








exports.uploadFile = (req,res)=>{

    var ext = "";
    var img = "";

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
             ext = path.extname(file.originalname);
             cb(null, 'uploads/banner');
         
        },
        filename: function(req, file, cb) {
            
          cb(null, Date.now() +path.extname(file.originalname));
        }
      });
      
      const upload = multer({ storage: storage });
      upload.single('file')(req,res,function (err){
        if (err instanceof multer.MulterError) {
            return res.status(400).json({status:false, message: 'File upload error', error: err });
          } else if (err) {
            return res.status(400).json({status:false, message: 'Server error', error: err });
          }
      
          if (!req.file) {
            return res.status(400).json({ message: 'No files were uploaded.' });
          }
          img = "/uploads/banner/"+req.file.filename;
          
          res.status(200).send({status:"success",message:"File Uploaded Successfully",data : img});
            
      });
}



