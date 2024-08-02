const ContactInfo = require("../models/ContactInfoModel.js");
const LocationInfo = require("../models/locationModel.js");
const multer = require('multer');
const path = require('path');
const SocailMedia = require("../models/socialMediaModel.js");
const PaymentModel = require("../models/paymentModel.js");
const IndividualKycModel = require("../models/individualKycModel.js");
const BusinessPhotoModel = require("../models/business_photo_model.js");
const TradeMemberModel = require("../models/trade_member_model.js");
const AwardCertificateMaster = require("../models/award_certificate_master.js");
const AwardCertficateModel = require("../models/award_certificate_master.js");
const { json } = require("express");
const LoginModel = require("../models/LoginModel.js");
const BusinessKycModel = require("../models/BusinessKycModel.js");
const BusinessInfo = require("../models/BusinessInfoModel.js");
const BusinessTimings = require("../models/BusinessTiming.js");
const ProductModel = require("../models/productModel.js");
const ServiceModel = require("../models/serviceModel.js");
const BrochureModel = require("../models/brochureModel.js");
const OwnerModel = require("../models/ownerModel.js");
const PhoneNumberModel = require("../models/phonenumberModel.js");
const BusinessInfoProgress = require("../models/business_info_progressModel.js");
const ManPowerModel = require("../models/manpowerModel.js");
exports.create = (req,res)=>{
    if(!req.body){
        res.status(400).send({
            message:"Content cannot be Empty"
        });
    }

    
  const binfo = new ContactInfo({
    uid : req.body.uid,
    phone : req.body.phone,
    whatsapp : req.body.whatsapp,
    name:req.body.name,
    designation:req.body.designation,
    nameprefix : req.body.nameprefix,
    landline : req.body.landline,
    tollfree : req.body.tollfree,
    email : req.body.email,
    addemail : req.body.addemail,
    createdby : req.body.uid,
    });
    
    
    var owners = req.body.owners;
    var numbers = req.body.numbers;
    ContactInfo.create(binfo,(err,data)=>{
        if(err){
            res.status(500).send({
               data
              });
        }
        else
            res.status(200).send(data);
    });

   
};

exports.uploadFile = (req,res)=>{

  const news = new ContactInfo({
    categoryid:req.body.categoryid,
    likes : 0,
    thumbimg : "",
    html_content : req.body.content,
    title : req.body.title,
    createdby:parseInt(req.body.userid)
    
    });

    console.log(req.body);

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename: function(req, file, cb) {
          cb(null, Date.now() + ".jpg"/*path.extname(file.originalname)*/);
        }
      });
      
      const upload = multer({ storage: storage });
      upload.single('file')(req,res,function (err){
        if (err instanceof multer.MulterError) {
            return res.status(400).json({status:false, message: 'File upload error', error: err });
          } else if (err) {
            return res.status(500).json({status:false, message: 'Server error', error: err });
          }
      
          if (!req.file) {
            return res.status(400).json({ message: 'No files were uploaded.' });
          }
          
          news.thumbimg = "/uploads/"+req.file.filename;
          res.status(200).send({status:"success",message:"Photo Uploaded Successfully",data :{thumb: news.thumbimg}});
            
      });
}


exports.getDtaa = (req,res)=>{
    
    ContactInfo.getData((req.body.uid),(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}

exports.addlocation = (req,res)=>{

  const model = new LocationInfo({
    uid : req.body.uid,
    // locationid : req.body.locationid,
    doorno : req.body.doorno,
    streetname : req.body.streetname,
    landmark : req.body.landmark,
    city : req.body.city,
    postalcode : req.body.postalcode,
    area : req.body.area,
    state : req.body.state,
    areaid : req.body.areaid,
    stateid : req.body.stateid,
    country : req.body.country,
    coordinates : req.body.coordinates,
    latitude : req.body.latitude,
    longitude : req.body.longitude,
    createdby : req.body.uid,
    // createdon : req.body.createdon
  })
    
    LocationInfo.create((model),(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}
exports.getLocationData = (req,res)=>{
    
    LocationInfo.getLocationData(req.body.uid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}
exports.getDistircts = (req,res)=>{
    
    LocationInfo.getDistricts(req.body.stateid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}
exports.Login = (req,res)=>{
    
    LoginModel.Login(req.body.phone,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}
exports.Signup = (req,res)=>{

  const model = new LoginModel({
   
    phone : req.body.phone,
    nameprefix : req.body.nameprefix,
    name : req.body.name
  })
    
    LoginModel.Signup(model,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}


exports.addSocialInfo = (req,res)=>{

  const model = new SocailMedia({
    uid : req.body.uid,
    // socialid : req.body.socialid,
    website : req.body.website,
    instagram : req.body.instagram,
    facebook : req.body.facebook,
    youtube : req.body.youtube,
    twitter : req.body.twitter,
    createdby : req.body.uid,
    // createdon : req.body.createdon
  })
    
    SocailMedia.create((model),(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}
exports.getSocailInfo = (req,res)=>{
    
    SocailMedia.getData(req.body.uid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}
exports.getPaymentInfo = (req,res)=>{
    
    PaymentModel.getPaymentData(req.body.uid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}

exports.addPaymentInfo = (req,res)=>{

  const model = new PaymentModel({
    uid : req.body.uid,
    // pinfoid  : req.body.pinfoid,
    C:req.body.C,
    D:req.body.D,
    N:req.body.N,
    U:req.body.U,
    W:req.body.W,
    Cs:req.body.Cs,
    acno:req.body.acno,
    bname:req.body.bname,
    bbranch:req.body.bbranch,
    bifsc:req.body.bifsc,
    bcheque:req.body.bcheque,
    createdby : req.body.uid,
    // createdon : req.body.createdon
  })
    
  PaymentModel.create((model),(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}

exports.getKYCInfo = (req,res)=>{
    
  IndividualKycModel.getKYCData(req.body.uid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}

exports.addKYCInfo = (req,res)=>{

  const model = new IndividualKycModel({
    uid : req.body.uid,
    photo:req.body.photo,
    aadhar:req.body.aadhar,
    frontaadhar:req.body.frontaadhar,
    backaadhar:req.body.backaadhar,
    pan:req.body.pan,
    frontpan:req.body.frontpan,
    backpan:req.body.backpan,
    verifyFlag:0,
    
    
  })
    
  IndividualKycModel.create((model),(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}
exports.addKYBInfo = (req,res)=>{

  const model = new BusinessKycModel({
    uid : req.body.uid,
    rc:req.body.rc,
    gst:req.body.gst,
    pan:req.body.pan,
    rentdeed:req.body.rentdeed,
    partnershipdeed:req.body.partnershipdeed,
    coa:req.body.coa,
    aoa:req.body.aoa,
    moa:req.body.moa,
    mgt:req.body.mgt,
    trustdeed:req.body.trustdeed,
    
    
  })
    
  BusinessKycModel.create((model),(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}


exports.getBusinessKYC = (req,res)=>{
    
  BusinessKycModel.getKYCData(req.body.uid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}


exports.getBPicture = (req,res)=>{
    
  BusinessPhotoModel.getInfo(req.body.uid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}

exports.addBPicture = (req,res)=>{

  const model = new BusinessPhotoModel({
    uid : req.body.uid,
    p1:req.body.p1,
    p2:req.body.p2,
    p3:req.body.p3,
    p4:req.body.p4,
    p5:req.body.p5,
    p6:req.body.p6,
    p7:req.body.p7,
    p8:req.body.p8,
    p9:req.body.p9,
    p10:req.body.p10,
    v1:req.body.v1,
    v2:req.body.v2,
    v3:req.body.v3,
    
    
  })
    
  BusinessPhotoModel.create((model),(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}
exports.addTradeData = (req,res)=>{

  const model = new TradeMemberModel({
    uid : req.body.uid,
    name:req.body.name,
    year:req.body.year,
    image:req.body.image,
    
    
  })
    
  TradeMemberModel.create((model),(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}

exports.addBusinessInfo = (req,res)=>{

  const model = new BusinessInfo({
    uid : req.body.uid,
    name:req.body.name,
    
    legalname : req.body.legalname,
    category : req.body.category,
    categoryid : req.body.categoryid,
    subcategory : req.body.subcategory,
    subcategoryid : req.body.subcategoryid,
    est : req.body.est,
    type : req.body.type,
    turnover : req.body.turnover,
    fy : req.body.fy,
    noofemp : req.body.noofemp,
    createdby : req.body.uid
    
    
  })
    
  BusinessInfo.create((model),(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}

exports.getBusinessInfo = (req,res)=>{
    
  BusinessInfo.getData(req.body.uid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}
exports.getSubCategory = (req,res)=>{
    
  BusinessInfo.getSubCategory(req.body.categoryid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}

exports.addProduct = (req,res)=>{

  const model = new ProductModel({
    uid : req.body.uid,
    productimg : req.body.productimg,
    name : req.body.name,
    description : req.body.description,
    category : req.body.category,
    businesstype : req.body.businesstype,
    brandname : req.body.brandname,
    origin : req.body.origin,
    pricetype : req.body.pricetype,
    price : req.body.price,
    offerprice : req.body.offerprice,
    units : req.body.units,
    minprice : req.body.minprice,
    maxprice : req.body.maxprice,
    minqty : req.body.minqty,
    maxqty : req.body.maxqty,
    createdby : req.body.uid
  })


  
  ProductModel.create(model,req.body.specs,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}
exports.updateProduct = (req,res)=>{

  const model = new ProductModel({
    uid : req.body.uid,
    productimg : req.body.productimg,
    name : req.body.name,
    description : req.body.description,
    category : req.body.category,
    businesstype : req.body.businesstype,
    brandname : req.body.brandname,
    origin : req.body.origin,
    pricetype : req.body.pricetype,
    price : req.body.price,
    offerprice : req.body.offerprice,
    units : req.body.units,
    minprice : req.body.minprice,
    maxprice : req.body.maxprice,
    minqty : req.body.minqty,
    maxqty : req.body.maxqty,
    createdby : req.body.uid
  })


  ProductModel.updateProduct(model,req.body.productid,req.body.specs,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}


exports.getProducts = (req,res)=>{
    
  ProductModel.getData(req.body.uid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}
exports.getProductSpec = (req,res)=>{
    
  ProductModel.getProductSpec(req.body.productid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}

exports.deleteProduct = (req,res)=>{
    
  ProductModel.deleteProduct(req.body.uid,req.body.productid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}
exports.deleteProductSpec = (req,res)=>{
    
  ProductModel.deleteProductSpec(req.body.productid,req.body.pspecid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}

exports.addService = (req,res)=>{

  const model = new ServiceModel({
    uid : req.body.uid,
    serviceimg : req.body.serviceimg,
    name : req.body.name,
    description : req.body.description,
    category : req.body.category,
   
    pricetype : req.body.pricetype,
    price : req.body.price,
    
    units : req.body.units,
    minprice : req.body.minprice,
    maxprice : req.body.maxprice,
   
    createdby : req.body.uid
  })


  ServiceModel.create((model),(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}
exports.updateService = (req,res)=>{

  const model = new ServiceModel({
    uid : req.body.uid,
    serviceimg : req.body.serviceimg,
    name : req.body.name,
    description : req.body.description,
    category : req.body.category,
   
    pricetype : req.body.pricetype,
    price : req.body.price,
    
    units : req.body.units,
    minprice : req.body.minprice,
    maxprice : req.body.maxprice,
   
    createdby : req.body.uid
  })


  ServiceModel.updateService(model,req.body.serviceid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}


exports.getService = (req,res)=>{
    
  ServiceModel.getData(req.body.uid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}

exports.deleteService = (req,res)=>{
    
  ServiceModel.deleteService(req.body.uid,req.body.serviceid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}


exports.addBrochure = (req,res)=>{

  const model = new BrochureModel({
    uid : req.body.uid,
    brochureimg : req.body.brochureimg,
    name : req.body.name,
    createdby : req.body.uid
  })


  BrochureModel.create((model),(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}


exports.getBrochure = (req,res)=>{
    
  BrochureModel.getData(req.body.uid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}

exports.deleteBrochure = (req,res)=>{
    
  BrochureModel.deleteBrochure(req.body.uid,req.body.brochureid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}

exports.addBusinessTiming = (req,res)=>{

  const model = new BusinessTimings({
    uid : req.body.uid,
    monfrom : req.body.monfrom,
    monto : req.body.monto,
    tuefrom : req.body.tuefrom,
    tueto : req.body.tueto,
    wedfrom : req.body.wedfrom,
    wedto : req.body.wedto,
    thurfrom : req.body.thurfrom,
    thurto : req.body.thurto,
    frifrom : req.body.frifrom,
    frito : req.body.frito,
    satfrom : req.body.satfrom,
    satto : req.body.satto,
    sunfrom : req.body.sunfrom,
    sunto : req.body.sunto,
    
    
  })
    
  BusinessTimings.addTimings((model),(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}


exports.addAward = (req,res)=>{

  const cer = req.body.certificate;
  const awar =req.body.award;

  const award = new AwardCertficateModel({
    uid : req.body.uid,
    name:awar.name,
    image:awar.image,
    year:awar.year
    
    
  })
  const certificate = new AwardCertficateModel({
    uid : req.body.uid,
    name:cer.name,
    image:cer.image,
    year:cer.year
    
    
  })

  console.log(award)
  console.log(certificate )
    
  AwardCertficateModel.create(([req.body.uid,award,certificate]),(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}



exports.getAward = (req,res)=>{
    
  AwardCertficateModel.getInfo(req.body.uid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}

exports.deleteAward = (req,res)=>{
    
  AwardCertficateModel.deleteAward(req.body.uid,req.body.awardid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}

exports.getBusinessInfoProgress = (req,res)=>{
    
  BusinessInfoProgress.getData(req.body.uid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}
exports.deletCertificate = (req,res)=>{
    
  AwardCertficateModel.deleteCertificate(req.body.uid,req.body.awardid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}

exports.addOwner = (req,res)=>{

  const model = new OwnerModel(
            {
                uid:req.body.uid,
                isprimary:req.body.isprimary,
                nameprefix:req.body.nameprefix,
                name:req.body.name,
                designation:req.body.designation,
                createdby:req.body.uid
            }
        )
  

 
  OwnerModel.create((model),(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}



exports.deleteOwner = (req,res)=>{
    
  OwnerModel.deleteOwner(req.body.uid,req.body.ownerid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}

exports.addPhone = (req,res)=>{

  const model = new PhoneNumberModel(
            {
                uid:req.body.uid,
                phone : req.body.phone,
                isprimary : req.body.isprimary,
                search : req.body.search,
                notification : req.body.notification,
                createdby:req.body.uid
            }
        )
  

 
  PhoneNumberModel.create((model),(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}



exports.deletePhone = (req,res)=>{
    
  PhoneNumberModel.deletePhoneNumber(req.body.uid,req.body.phoneid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}



exports.deleteTradeData = (req,res)=>{

  
    
  TradeMemberModel.deleteInfo([req.body.uid,req.body.tradeid],(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}

exports.getTradeData = (req,res)=>{
    
  TradeMemberModel.getInfo(req.body.uid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}

exports.uploadCheque = (req,res)=>{

 

    console.log(req.body);

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename: function(req, file, cb) {
          cb(null, Date.now() + ".jpg"/*path.extname(file.originalname)*/);
        }
      });
      
      const upload = multer({ storage: storage });
      upload.single('cheque')(req,res,function (err){
        if (err instanceof multer.MulterError) {
            return res.status(400).json({status:false, message: 'File upload error', error: err });
          } else if (err) {
            return res.status(500).json({status:false, message: 'Server error', error: err });
          }
      
          if (!req.file) {
            return res.status(400).json({ message: 'No files were uploaded.' });
          }
          
          var thumbimg = "/uploads/"+req.file.filename;
          res.status(200).send({status:"success",message:"Photo Uploaded Successfully",data :{thumb: thumbimg}});
            
      });
}

exports.uploadkyc = (req,res)=>{

 

  console.log(req.body);

  const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, 'uploads/kyc/');
      },
      filename: function(req, file, cb) {
        cb(null, Date.now() + ".jpg"/*path.extname(file.originalname)*/);
      }
    });
    
    const upload = multer({ storage: storage });
    upload.single('kyc')(req,res,function (err){
      if (err instanceof multer.MulterError) {
          return res.status(400).json({status:false, message: 'File upload error', error: err });
        } else if (err) {
          return res.status(500).json({status:false, message: 'Server error', error: err });
        }
    
        if (!req.file) {
          return res.status(400).json({ message: 'No files were uploaded.' });
        }
        
        var thumbimg = "/uploads/kyc/"+req.file.filename;
        res.status(200).send({status:"success",message:"File Uploaded Successfully",data :{thumb: thumbimg}});
          
    });
}
exports.uploadphoto = (req,res)=>{

  const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, 'uploads/business/photo');
      },
      filename: function(req, file, cb) {
        cb(null, Date.now() + ".jpg"/*path.extname(file.originalname)*/);
      }
    });
    
    const upload = multer({ storage: storage });
    upload.single('file')(req,res,function (err){
      if (err instanceof multer.MulterError) {
          return res.status(400).json({status:false, message: 'File upload error', error: err });
        } else if (err) {
          return res.status(500).json({status:false, message: 'Server error', error: err });
        }
    
        if (!req.file) {
          return res.status(400).json({ message: 'No files were uploaded.' });
        }
        
        var thumbimg = "/uploads/business/photo/"+req.file.filename;
        res.status(200).send({status:"success",message:"File Uploaded Successfully",data :{thumb: thumbimg}});
          
    });
}
exports.uploadKYBPhoto = (req,res)=>{

  const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, 'uploads/business/kyb');
      },
      filename: function(req, file, cb) {
        cb(null, Date.now() + ".jpg"/*path.extname(file.originalname)*/);
      }
    });
    
    const upload = multer({ storage: storage });
    upload.single('file')(req,res,function (err){
      if (err instanceof multer.MulterError) {
          return res.status(400).json({status:false, message: 'File upload error', error: err });
        } else if (err) {
          return res.status(500).json({status:false, message: 'Server error', error: err });
        }
    
        if (!req.file) {
          return res.status(400).json({ message: 'No files were uploaded.' });
        }
        
        var thumbimg = "/uploads/business/kyb/"+req.file.filename;
        res.status(200).send({status:"success",message:"File Uploaded Successfully",data :{thumb: thumbimg}});
          
    });
}

exports.uploadPdfFile = (req,res)=>{

  const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, 'uploads/business/kyb');
      },
      filename: function(req, file, cb) {
        cb(null, Date.now() + ".pdf"/*path.extname(file.originalname)*/);
      }
    });
    
    const upload = multer({ storage: storage });
    upload.single('file')(req,res,function (err){
      if (err instanceof multer.MulterError) {
          return res.status(400).json({status:false, message: 'File upload error', error: err });
        } else if (err) {
          return res.status(500).json({status:false, message: 'Server error', error: err });
        }
    
        if (!req.file) {
          return res.status(400).json({ message: 'No files were uploaded.' });
        }
        
        var thumbimg = "/uploads/business/kyb/"+req.file.filename;
        res.status(200).send({status:"success",message:"File Uploaded Successfully",data :{thumb: thumbimg}});
          
    });
}

exports.uploadCertificate = (req,res)=>{

  const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, 'uploads/business/certificates');
      },
      filename: function(req, file, cb) {
        cb(null, Date.now() + ".jpg"/*path.extname(file.originalname)*/);
      }
    });
    
    const upload = multer({ storage: storage });
    upload.single('file')(req,res,function (err){
      if (err instanceof multer.MulterError) {
          return res.status(400).json({status:false, message: 'File upload error', error: err });
        } else if (err) {
          return res.status(500).json({status:false, message: 'Server error', error: err });
        }
    
        if (!req.file) {
          return res.status(400).json({ message: 'No files were uploaded.' });
        }
        
        var thumbimg = "/uploads/business/certificates/"+req.file.filename;
        res.status(200).send({status:"success",message:"File Uploaded Successfully",data :{thumb: thumbimg}});
          
    });
}
exports.uploadthumbnail = (req,res)=>{

  const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, 'uploads/business/videothumb');
      },
      filename: function(req, file, cb) {
        cb(null, Date.now() + ".jpg"/*path.extname(file.originalname)*/);
      }
    });
    
    const upload = multer({ storage: storage });
    upload.single('file')(req,res,function (err){
      if (err instanceof multer.MulterError) {
          return res.status(400).json({status:false, message: 'File upload error', error: err });
        } else if (err) {
          return res.status(500).json({status:false, message: 'Server error', error: err });
        }
    
        if (!req.file) {
          return res.status(400).json({ message: 'No files were uploaded.' });
        }
        
        var thumbimg = "/uploads/business/videothumb/"+req.file.filename;
        res.status(200).send({status:"success",message:"File Uploaded Successfully",data :{thumb: thumbimg}});
          
    });
}

exports.uploadvideo = (req,res)=>{

  const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, 'uploads/business/video');
      },
      filename: function(req, file, cb) {
        cb(null, Date.now() + ".mp4"/*path.extname(file.originalname)*/);
      }
    });
    
    const upload = multer({ storage: storage });
    upload.single('file')(req,res,function (err){
      if (err instanceof multer.MulterError) {
          return res.status(400).json({status:false, message: 'File upload error', error: err });
        } else if (err) {
          return res.status(500).json({status:false, message: 'Server error', error: err });
        }
    
        if (!req.file) {
          return res.status(400).json({ message: 'No files were uploaded.' });
        }
        
        var thumbimg = "/uploads/business/video/"+req.file.filename;
        res.status(200).send({status:"success",message:"File Uploaded Successfully",data :{thumb: thumbimg}});
          
    });
}


exports.getNewsDetail = (req,res)=>{
    
  ContactInfo.getNewsDetail(req.body.newsid,req.body.userid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}

exports.delete = (req,res)=>{
    
  ContactInfo.delete(req.body.newsid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}
exports.addLike = (req,res)=>{
  ContactInfo.addLike([req.body.userid,req.body.newsid],(err,data)=>{
      if(err){
          res.status(500).send({
             data
            });
      }
      else
          res.status(200).send(data);
  });
  

 
};

exports.addBookmark = (req,res)=>{
  ContactInfo.addBookamrk([req.body.userid,req.body.newsid],(err,data)=>{
      if(err){
          res.status(500).send({
             data
            });
      }
      else
          res.status(200).send(data);
  });
  

 
};

exports.getBookmark = (req,res)=>{
    
  ContactInfo.getBookmarks(req.body.userid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}
exports.getManPowerData = (req,res)=>{
    
  ManPowerModel.getData(req.body.bid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}
exports.deleteManPowerData = (req,res)=>{
    
  ManPowerModel.deleteData(req.body.manreqid,(err,data)=>{
      if(err){
          res.status(500).send(data);
      }
      else
          res.status(200).json(data);
  })
}


exports.addManPowerData = (req,res)=>{
  
  const model = new ManPowerModel(
            {
              bid :req.body.bid,
              title :req.body.title,
              jobtype :req.body.jobtype,
              description :req.body.description,
              skill :req.body.skill,
              qualification :req.body.qualification,
              experience :req.body.experience,
              salaryfrom :req.body.salaryfrom,
              salaryto :req.body.salaryto,
              gender :req.body.gender,
              age :req.body.age,
              employementtype :req.body.employementtype,
              noofvacancies :req.body.noofvacancies,
              startdate :req.body.startdate,
              active :req.body.active,
              enddate :req.body.enddate
            }
        )
  
        
 
    ManPowerModel.addData(model,req.body.manreqid,(err,data)=>{
    
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
}
