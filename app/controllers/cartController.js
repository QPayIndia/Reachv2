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



exports.getCartData = (req,res)=>{
    
    CartModel.getData(req.body.userid,req.body.type,(err,data)=>{
        if(err){
            res.status(500).send(data);
        }
        else
            res.status(200).send(data);
    })
}


exports.updateCart = (req,res)=>{
    
    CartModel.updateCart(req.body.uid,req.body.productid,req.body.ischecked,req.body.qty,req.body.type,(err,data)=>{
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