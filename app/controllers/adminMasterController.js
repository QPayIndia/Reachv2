const adminModel = require("../models/adminMaster.js");
const multer = require('multer');
const path = require('path');

exports.getAllMerchants = (req,res)=>{
   
    

    adminModel.getAllMerchants(req.body.uid,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    });
};
exports.getPendingMerchants = (req,res)=>{
   
    

    adminModel.getPendingMerchants(req.body.uid,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    });
};
exports.getAllUsers = (req,res)=>{
   
    
    console.log(req.body.uid);
    
    adminModel.getAllUsers(req.body.uid,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    });
};

exports.addUser = (req,res)=>{
    adminModel.addUser(req.body.username,req.body.password,req.body.usertype,req.body.uid,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    });
};

exports.updateMerchantActiveStatus = (req,res)=>{
   
    

    adminModel.updateMerchantActiveStatus(req.body.bid,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    });
};
exports.login = (req,res)=>{
   
    

    adminModel.login(req.body.phone,req.body.password,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    });
};
exports.deleteBusiness = (req,res)=>{
   
    

    adminModel.deleteBusiness(req.body.bid,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    });
};


//Home Banner

exports.AddHomeBanner = (req,res)=>{
   
    adminModel.addBanner(req.body.title,req.body.url,req.body.uid,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    });
};

exports.UpdateHomeBannerStatus = (req,res)=>{
   
    adminModel.updateBannerStatus(req.body.bannerid,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    });
};

exports.GetAllBanner = (req,res)=>{
   
    adminModel.getHomeBanner(req.body.uid,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
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




