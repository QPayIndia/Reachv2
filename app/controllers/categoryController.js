const Category = require("../models/categoryModel.js");


exports.create = (req,res)=>{
    if(!req.body){
        res.status(400).send({
            message:"Content cannot be Empty"
        });
    }

    
    const model = new Category({
        title:req.body.title,
        createdby:req.body.userid,
        
    });

    Category.create(model,(err,data)=>{
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


exports.getAll = (req,res)=>{
    
    Category.getAll((err,data)=>{
        if(err){
            res.status(500).send({
                data
              });
        }
        else
            res.status(200).send(data)
    })
}

exports.delete = (req,res)=>{
    
    Category.delete(req.body.categoryid,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).json(data);
    })
  }

// exports.getMyTeams = (req,res)=>{
   
//     Team.getMyTeams(req.body.userId,(err,rows)=>{
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
   
//     Team.getOppTeams(req.body.userId,(err,rows)=>{
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