const CartModel = require("../models/CartModel.js");
const OrderModel = require("../models/OrderModel.js");

const ServiceCartModel = function(model){
    this.userid = model.userid,
    this.serviceid = model.serviceid,
    this.ischecked = model.ischecked,
    this.qty = model.qty
   
}


exports.add = (req,res)=>{
    if(!req.body){
        res.status(400).send({
            message:"Content cannot be Empty"
        });
    }

    let model = null;
   

    if(req.body.type == 'product'){
        model = new CartModel({
            userid:req.body.userid,
            ischecked:true,
            qty:req.body.qty,
           productid : req.body.productid
            
        });
       
    }else if(req.body.type == 'service'){
        model = new ServiceCartModel({
            userid:req.body.userid,
            ischecked:true,
            qty:req.body.qty,
            serviceid : req.body.serviceid
            
        });
    }

    CartModel.create(model,req.body.type,(err,data)=>{
        if(err){
            res.status(400).send({
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
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    })
}



exports.updateCart = (req,res)=>{
    
    CartModel.updateCart(req.body.uid,req.body.cartid,req.body.ischecked,req.body.qty,req.body.type,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    })
}
exports.Checkout = (req,res)=>{
    
    CartModel.Checkout(req.body.uid,req.body.type,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    })
}


exports.ViewOrders = (req,res)=>{
    
    OrderModel.getData(req.body.userid,req.body.type,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    })
}


exports.GetMerchantOrders = (req,res)=>{
    
    OrderModel.getMerchantOrders(req.body.bid,req.body.type,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    })
}
exports.GetOrderDetails = (req,res)=>{
    
    OrderModel.getOrderDetails(req.body.orderitemid,req.body.type,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    })
}
exports.UpdateStatus = (req,res)=>{
    
    OrderModel.UpdateStatus(req.body.orderitemid,req.body.status,req.body.type,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    })
}


// exports.getMyTeams = (req,res)=>{
   
//     User.getMyTeams(req.body.userId,(err,rows)=>{
//         if(err){
//             res.status(400).json({
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
//             res.status(400).json({
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