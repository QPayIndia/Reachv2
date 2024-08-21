const CartModel = require("../models/CartModel.js");


exports.add = (req,res)=>{
    if(!req.body){
        res.status(400).send({
            message:"Content cannot be Empty"
        });
    }

    
    const model = new CartModel({
        userid:req.body.userid,
        ischecked:true,
        qty:req.body.qty
        
    });

    if(req.body.type == 'product'){
        model.productid = req.body.productid
    }else if(req.body.type == 'service'){
        model.productid = req.body.serviceid
    }else{
        model.productid = 0
    }

    CartModel.create(model,req.body.type,(err,data)=>{
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


exports.getCartData = (req,res)=>{
    
    CartModel.getData(req.body.userid,req.body.type,(err,data)=>{
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