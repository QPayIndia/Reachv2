const { json } = require('express');
const sql = require('./db.js');
const { add } = require('./userModel.js');

const ReportModel = function(model){
    this.bid = model.bid,
    this.userid = model.userid,
    this.r1 = model.r1,
    this.r1c = model.r1c,
    this.r2 = model.r2,
    this.r2c = model.r2c,
    this.r3 = model.r3,
    this.r3c = model.r3c,
    this.r4 = model.r4,
    this.r4c = model.r4c
   
    
    
}




ReportModel.getData = (bid,result)=>{
    
getData(bid).then((data)=>{
	result(null,{status:"success",message:"Report Fetched Successfully",data:data});
});
   
  
}
ReportModel.addData = (model,result)=>{
    
	addData(model).then((id)=>{
        result(null,{status:"success",message:"Report Inserted Successfully",manreqid:id});
    }).catch((err)=>{
        result(err,{status:"failure",message:"Report Insert Failed"});
    });

  
}
ReportModel.deleteData = (manreqid,result)=>{
   
	getDataByID(manreqid).then((data)=>{
		if(data.length > 0){
			deleteData(manreqid).then(()=>{
				result(null,{status:"success",message:"Report Deleted Successfully"});
			}).catch((err)=>{
				result(err,{status:"failure",message:"Report Delete Failed"});
			});
			   
		}else{
			result(null,{status:"failure",message:"No Data Found"});
		}
	});
	

  
}

function getData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM manpower_req_master WHERE bid = ?",[uid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Report Fetch Failed due to '+err);
                    return;
                }
                console.log('Report Fetched successfully');
				
			
                resolve(data);
            })
    });
}
function getDataByID(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM manpower_req_master WHERE manreqid = ?",[uid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Report Fetch Failed due to '+err);
                    return;
                }
                console.log('Report Fetched successfully');
				
			
                resolve(data);
            })
    });
}
function addData(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO report_master SET ?",[model],(err,data)=>{
                if(err){
                    reject();
                    console.log('Report Insert Failed due to '+err);
                    return;
                }
                console.log('Report Inserted successfully');
				
			
                resolve(data.insertId);
            })
    });
}
function updateData(model,manreqid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE manpower_req_master SET ? WHERE manreqid = ?",[model,manreqid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Report Updated Failed due to '+err);
                    return;
                }
                console.log('Report Updated successfully');
				
			
                resolve();
            })
    });
}
function deleteData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM manpower_req_master WHERE manreqid = ?",[uid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Report Delete Failed due to '+err);
                    return;
                }
                console.log('Report Delete successfully');
				
			
                resolve();
            })
    });
}





module.exports = ReportModel;