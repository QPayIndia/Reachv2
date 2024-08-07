const AddressModel = require("../models/addressModel.js");
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


exports.addUser = (req,res)=>{


    const model = new User(
        {
            name : req.body.name,
            lastname : req.body.lastname,
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