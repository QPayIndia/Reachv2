const Bookmark = require("../models/bookmarkModel.js");


// exports.create = (req,res)=>{
//     if(!req.body){
//         res.status(400).send({
//             message:"Content cannot be Empty"
//         });
//     }

    
//     const team = new Bookmark({
//         name:req.body.name,
//         profile:req.body.profile,
//         location:req.body.location,
//     });

//     Bookmark.create(team,(err,data)=>{
//         if(err){
//             res.status(500).send({
//                 message:
//                   err.message || "Something went wrong."
//               });
//         }
//         else
//             res.status(200).send(data);
//     });

   
// };


// exports.getAllTeams = (req,res)=>{
    
//     Bookmark.getAllTeams(req.body.location,(err,data)=>{
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
   
//     Bookmark.getMyTeams(req.body.userId,(err,rows)=>{
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
   
//     Bookmark.getOppTeams(req.body.userId,(err,rows)=>{
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