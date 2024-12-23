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

const StaffLocationModel = function(model){
    this.bid = model.bid,
    this.staffid = model.staffid,
    this.latitude = model.latitude,
    this.longitude = model.longitude,
    this.createdby = model.createdby
}

const ExpenseModel = function(model){
  
    this.staffid = model.staffid,
    this.title = model.title,
    this.amount = model.amount,
    this.bill = model.bill,
    this.status = model.status
   
}

const FollowUpModel = function(model){
    this.bid = model.bid,
    this.staffid = model.staffid,
    this.appdate = model.appdate,
    this.apptime = model.apptime,
    this.remarks = model.remarks,
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


exports.getHomeData = (req,res)=>{
   
    staffModel.getHomeData(req.body.userid,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    });
};

exports.UpdateBusinessStatus = (req,res)=>{
   
    RequestValidator.validateRequest(req,res,["bid","staffid","status","latitude","longitude"],(auth)=>{
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
                else{

                    const model = new StaffLocationModel({
                        bid:req.body.bid,
                        staffid:req.body.userid,
                        latitude:req.body.latitude,
                        longitude:req.body.longitude,
                        createdby:req.body.userid
                    })

                    StaffModel.InsertLocationLog(model,(err,data)=>{
                        if(err){
                            res.status(400).send(data);
                        }
                        else{
                            if(req.body.status === "IN FOLLOWUP"){
                                const model = new FollowUpModel({
                                    bid:req.body.bid,
                                    staffid:req.body.userid,
                                    appdate:req.body.appdate,
                                    apptime:req.body.apptime,
                                    remarks:req.body.remarks,
                                    status:"PENDING",
                                    createdby:req.body.userid
                                });
            
                                StaffModel.AddFollowUp(model,0,(err,data)=>{
                                    if(err){
                                        res.status(400).send(data);
                                    }
                                    else{
                                        res.status(200).send(data);
                                    }
                                })
                            }
                            else
                                res.status(200).send(data);
                        }
                    })



                    
                    
                }
                    
            });
        }
    });
};


exports.AddFollowUp = (req,res)=>{
   
    RequestValidator.validateRequest(req,res,["bid","staffid","appdate","apptime","status"],(auth)=>{
        if(auth){

           
            const model = new FollowUpModel({
                bid:req.body.bid,
                staffid:req.body.userid,
                appdate:req.body.appdate,
                apptime:req.body.apptime,
                remarks:req.body.remarks,
                status:req.body.status,
                createdby:req.body.userid
            });

            const followupid = (req.body.followupid != null) ? req.body.followupid : 0;

            StaffModel.AddFollowUp(model,followupid,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else{
                    res.status(200).send(data);
                }
            })
        }
    });
};

exports.AddExpense = (req,res)=>{
   
    RequestValidator.validateRequest(req,res,["staffid","title","amount","bill"],(auth)=>{
        if(auth){

           
            const model = new ExpenseModel({
               
                staffid:req.body.staffid,
                title:req.body.title,
                amount:req.body.amount,
                bill:req.body.bill,
                status:"PENDING",
                
            });

            const expenseid = (req.body.expenseid != null) ? req.body.expenseid : 0;

            StaffModel.AddExpense(model,expenseid,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else{
                    res.status(200).send(data);
                }
            })
        }
    });
};

exports.GetExpense = (req,res)=>{
   
    RequestValidator.validateRequest(req,res,["staffid","date"],(auth)=>{
        if(auth){

           
            

            StaffModel.GetExpense(req.body.staffid,req.body.date,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else{
                    res.status(200).send(data);
                }
            })
        }
    });
};


exports.getFollowups = (req,res)=>{
   
    RequestValidator.validateRequest(req,res,["staffid","appdate"],(auth)=>{
        if(auth){

           
            

            StaffModel.GetFollowupDate(req.body.staffid,req.body.appdate,(err,data)=>{
                if(err){
                    res.status(400).send(data);
                }
                else{
                    res.status(200).send(data);
                }
            })
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








exports.uploadBill = (req,res)=>{

    var ext = "";
    var img = "";
   
    
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            
             ext = path.extname(file.originalname);
             cb(null, 'uploads/staff/bill');
         
        },
        filename: function(req, file, cb) {
            
          cb(null, Date.now() +".jpg");
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

        
          img = "/uploads/staff/bill/"+req.file.filename;
          
          res.status(200).send({status:"success",message:"File Uploaded Successfully",data : img});
            
      });
}




