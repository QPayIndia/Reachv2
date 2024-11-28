const AddressModel = require("../models/addressModel.js");
const BusinessFavouriteModel = require("../models/business_fav_model.js");
const User = require("../models/userModel.js");


exports.login = (req,res)=>{
    if(!req.body){
        res.status(400).send({
            message:"Content cannot be Empty"
        });
    }

    
    const team = new User({
        username:req.body.username,
        password:req.body.password
        
    });

    User.login(team,(err,data)=>{
        if(err){
            res.status(500).send({
                message:
                  err.message || "Something went wrong."
              });
        }
        else if(data['status'] == 'failure')
            res.status(403).send(data);
        else
        res.status(200).send(data);
    });

   
};

exports.add = (req,res)=>{

    console.log(1)
    if(!req.body){
        res.status(400).send({
            message:"Content cannot be Empty"
        });
    }

    
   

    User.add(req.body.username,(err,data)=>{
        if(data['status'] == 'failure')
            res.status(403).send(data);
        else
        res.status(200).send(data);
    });

   
};
exports.addUserAddress = (req,res)=>{


    const model = new AddressModel(
        {
            userid : req.body.userid,
            contactname : req.body.contactname,
            contactphone : req.body.contactphone,
            doorno : req.body.doorno,
            streetname : req.body.streetname,
            landmark : req.body.landmark,
            city : req.body.city,
            postalcode : req.body.postalcode,
            area : req.body.area,
            state : req.body.state,
            areaid : req.body.areaid,
            stateid : req.body.stateid,
            country : req.body.country
        });
   

    AddressModel.create(model,req.body.addressid,(err,data)=>{
        if(err)
            res.status(500).send(data);
        else
            res.status(200).send(data);
    });

   
};


exports.getAllAddress = (req,res)=>{
    
    AddressModel.getLocationData(req.body.userid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    })
}


exports.deleteAddress = (req,res)=>{
    
    AddressModel.deleteData(req.body.addressid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    })
}

exports.updateName = (req,res)=>{
    
    User.updateName(req.body.name,req.body.lastname,req.body.uid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    })
}

exports.updateEmail = (req,res)=>{
    
    User.updateEmail(req.body.email,req.body.uid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    })
}

exports.updateDOB = (req,res)=>{
    
    User.updateDOB(req.body.dob,req.body.uid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    })
}
exports.getPrimaryAddress = (req,res)=>{
    
    AddressModel.getPrimaryAddress(req.body.userid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    })
}
exports.updatePrimaryAddress = (req,res)=>{
    
    AddressModel.UpdatePrimaryAddress(req.body.userid,req.body.addressid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    })
}
exports.getFavBusiness = (req,res)=>{
    
    BusinessFavouriteModel.getFavBusiness(req.body.userid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    })
}
exports.updateBusinessFavourite = (req,res)=>{

    const model = new BusinessFavouriteModel(
        {
            userid : req.body.userid,
            bid : req.body.bid
           
        });
    
    BusinessFavouriteModel.updateFavourite(model,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    })
}


exports.addUser = (req,res)=>{


    const model = new User(
        {
            name : req.body.name,
            lastname : req.body.lastname,
            email : req.body.email,
            phone : req.body.phone,
            photo : req.body.photo,
            occupation : req.body.occupation,
            dob : req.body.dob
        });
   

    User.addUser(model,req.body.uid,(err,data)=>{
        if(err)
            res.status(500).send(data);
        else
            res.status(200).send(data);
    });

   
};

exports.getUser = (req,res)=>{
    
    User.getUserById(req.body.uid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    })
}

exports.SendOTP = (req,res)=>{
    
    User.sendOTP(req.body.uid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    })
}

exports.VerifyOTP = (req,res)=>{
    
    User.verifyOTP(req.body.phone,req.body.otp,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    })
}
exports.Auth = (req,res)=>{
    
    User.Auth(req.body.userid,req.body.refKey,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    })
}




// exports.getMyTeams = (req,res)=>{
   
//     User.getMyTeams(req.body.userId,(err,rows)=>{
//         if(err){
//             res.status(500).json({
//                 message:"Something went wrong"
//             });
//         }
//         else{
//             res.status(200).json({
//                 teams : rows
//             })
//         }
//     });
// }
// exports.getOppTeams = (req,res)=>{
   
//     User.getOppTeams(req.body.userId,(err,rows)=>{
//         if(err){
//             res.status(500).json({
//                 message:"Something went wrong"
//             });
//         }
//         else{
//             res.status(200).json({
//                 teams : rows
//             })
//         }
//     });
// }