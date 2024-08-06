const { json } = require('express');
const sql = require('./db.js');
const { add } = require('./userModel.js');

const FAQModel = function(model){
    this.bid = model.bid,
    this.question = model.question,
    this.answer = model.answer

    
    
    
}




FAQModel.getData = (bid,result)=>{
    
getData(bid).then((data)=>{
	result(null,{status:"success",message:"FAQ Fetched Successfully",data:data});
});
   
  
}
FAQModel.addData = (model,faqid,result)=>{
    
	if(faqid == 0){
		addData(model).then((id)=>{
			result(null,{status:"success",message:"FAQ Inserted Successfully",faqid:id});
		}).catch((err)=>{
			result(err,{status:"failure",message:"FAQ Insert Failed"});
		});
		   
	}else{
		updateData(model,faqid).then(()=>{
			result(null,{status:"success",message:"FAQ Updated Successfully",faqid:faqid});
		}).catch((err)=>{
			result(err,{status:"failure",message:"FAQ Update Failed"});
		});
	}

  
}
FAQModel.deleteData = (faqid,result)=>{
   
	getDataByID(faqid).then((data)=>{
		if(data.length > 0){
			deleteData(faqid).then(()=>{
				result(null,{status:"success",message:"FAQ Deleted Successfully"});
			}).catch((err)=>{
				result(err,{status:"failure",message:"FAQ Delete Failed"});
			});
			   
		}else{
			result(null,{status:"failure",message:"No Data Found"});
		}
	});
	

  
}

function getData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM faq_master WHERE bid = ?",[uid],(err,data)=>{
                if(err){
                    reject();
                    console.log('FAQ Fetch Failed due to '+err);
                    return;
                }
                console.log('FAQ Fetched successfully');
				
			
                resolve(data);
            })
    });
}
function getDataByID(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM faq_master WHERE faqid = ?",[uid],(err,data)=>{
                if(err){
                    reject();
                    console.log('FAQ Fetch Failed due to '+err);
                    return;
                }
                console.log('FAQ Fetched successfully');
				
			
                resolve(data);
            })
    });
}
function addData(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO faq_master SET ?",[model],(err,data)=>{
                if(err){
                    reject();
                    console.log('FAQ Insert Failed due to '+err);
                    return;
                }
                console.log('FAQ Inserted successfully');
				
			
                resolve(data.insertId);
            })
    });
}
function updateData(model,faqid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE faq_master SET ? WHERE faqid = ?",[model,faqid],(err,data)=>{
                if(err){
                    reject();
                    console.log('FAQ Updated Failed due to '+err);
                    return;
                }
                console.log('FAQ Updated successfully');
				
			
                resolve();
            })
    });
}
function deleteData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM faq_master WHERE faqid = ?",[uid],(err,data)=>{
                if(err){
                    reject();
                    console.log('FAQ Delete Failed due to '+err);
                    return;
                }
                console.log('FAQ Delete successfully');
				
			
                resolve();
            })
    });
}





module.exports = FAQModel;