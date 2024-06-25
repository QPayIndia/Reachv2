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


// exports.getAllTeams = (req,res)=>{
    
//     User.getAllTeams(req.body.location,(err,data)=>{
//         if(err){
//             res.status(500).send({
//                 message:
//                   err.message || "Something went wrong."
//               });
//         }
//         else
//             res.status(200).json({
//         teams : data
//         });
//     })
// }

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