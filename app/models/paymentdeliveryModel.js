const { json } = require('express');
const sql = require('./db.js');
const { add } = require('./userModel.js');

const PaymentDeliveryModel = function(model){
    this.bid = model.bid,
    this.one = model.one,
    this.two = model.two,
    this.three = model.three,
    this.four = model.four,
    this.five = model.five,
    this.six = model.six,
    this.seven = model.seven,
    this.partpercentage = model.partpercentage
    
    
    
}




PaymentDeliveryModel.getData = (bid,result)=>{
    
getData(bid).then((data)=>{
    
        if(data.length == 0){

            const model = new PaymentDeliveryModel(
                {
                  bid :bid,
                 one: true,
                 two: false,
                 three: false,
                 four: false,
                 five:false,
                 six: false,
                 seven: false,
                 partpercentage : 10
    
                }
            )
      
            
            addData(model).then((id)=>{
                getData(bid).then((data)=>{
                    result(null,{status:"success",message:"Payment Delivery Type Fetched Successfully",data:data[0]});
                }).catch((err)=>{
                    result(err,{status:"failure",message:"Payment Delivery Type Fetch Failed"});
                });
            }).catch((err)=>{
                result(err,{status:"failure",message:"Payment Delivery Type Fetch Failed"});
            });
        }else{
            result(null,{status:"success",message:"Payment Delivery Type Fetched Successfully",data:data[0]});
        }
        
    
	
});
   
  
}
PaymentDeliveryModel.addData = (model,paytypeid,result)=>{
    
	if(paytypeid == 0){
		// addData(model).then((id)=>{
		// 	result(null,{status:"success",message:"Payment Delivery Type Inserted Successfully",paytypeid:id});
		// }).catch((err)=>{
		// 	result(err,{status:"failure",message:"Payment Delivery Type Insert Failed"});
		// });
        result("",{status:"failure",message:"Payment Delivery Type Update Failed"});
		   
	}else{
		updateData(model,paytypeid).then(()=>{
            getData(model.bid).then((data)=>{
                result(null,{status:"success",message:"Payment Delivery Type Updated Successfully",data:data[0]});
            }).catch((err)=>{
                result(err,{status:"failure",message:"Payment Delivery Type Update Failed"});
            });
			
		}).catch((err)=>{
			result(err,{status:"failure",message:"Payment Delivery Type Update Failed"});
		});
	}

  
}
PaymentDeliveryModel.deleteData = (paytypeid,result)=>{
   
	getDataByID(paytypeid).then((data)=>{
		if(data.length > 0){
			deleteData(paytypeid).then(()=>{
				result(null,{status:"success",message:"Payment Delivery Type Deleted Successfully"});
			}).catch((err)=>{
				result(err,{status:"failure",message:"Payment Delivery Type Delete Failed"});
			});
			   
		}else{
			result(null,{status:"failure",message:"No Data Found"});
		}
	});
	

  
}

function getData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM payment_delivery_master WHERE bid = ? LIMIT 1",[uid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Payment Delivery Type Fetch Failed due to '+err);
                    return;
                }
                console.log('Payment Delivery Type Fetched successfully');
				
			
                resolve(data);
            })
    });
}
function getDataByID(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM payment_delivery_master WHERE paytypeid = ?",[uid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Payment Delivery Type Fetch Failed due to '+err);
                    return;
                }
                console.log('Payment Delivery Type Fetched successfully');
				
			
                resolve(data);
            })
    });
}
function addData(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO payment_delivery_master SET ?",[model],(err,data)=>{
                if(err){
                    reject();
                    console.log('Payment Delivery Type Insert Failed due to '+err);
                    return;
                }
                console.log('Payment Delivery Type Inserted successfully');
				
			
                resolve(data.insertId);
            })
    });
}
function updateData(model,paytypeid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE payment_delivery_master SET ? WHERE paytypeid = ?",[model,paytypeid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Payment Delivery Type Updated Failed due to '+err);
                    return;
                }
                console.log('Payment Delivery Type Updated successfully');
				
			
                resolve();
            })
    });
}
function deleteData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM payment_delivery_master WHERE paytypeid = ?",[uid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Payment Delivery Type Delete Failed due to '+err);
                    return;
                }
                console.log('Payment Delivery Type Delete successfully');
				
			
                resolve();
            })
    });
}





module.exports = PaymentDeliveryModel;