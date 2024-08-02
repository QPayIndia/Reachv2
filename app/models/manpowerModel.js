const { json } = require('express');
const sql = require('./db.js');
const { add } = require('./userModel.js');

const ManPowerModel = function(model){
    this.bid = model.bid,
    this.title = model.title,
    this.jobtype = model.jobtype,
    this.description = model.description,
    this.skill = model.skill,
    this.qualification = model.qualification,
    this.experience = model.experience,
    this.salaryfrom = model.salaryfrom,
    this.salaryto = model.salaryto,
    this.gender = model.gender,
    this.age = model.age,
    this.employementtype = model.employementtype,
    this.noofvacancies = model.noofvacancies,
    this.startdate = model.startdate,
    this.active = model.active,
    this.enddate = model.enddate
    
    
}




ManPowerModel.getData = (bid,result)=>{
    
getData(bid).then((data)=>{
	result(null,{status:"success",message:"Manpower Req Fetched Successfully",data:data});
});
   
  
}
ManPowerModel.addData = (model,manreqid,result)=>{
    
	if(manreqid == 0){
		addData(model).then((id)=>{
			result(null,{status:"success",message:"Manpower Req Inserted Successfully",manreqid:id});
		}).catch((err)=>{
			result(err,{status:"failure",message:"Manpower Req Insert Failed"});
		});
		   
	}else{
		updateData(model,manreqid).then(()=>{
			result(null,{status:"success",message:"Manpower Req Updated Successfully",manreqid:manreqid});
		}).catch((err)=>{
			result(err,{status:"failure",message:"Manpower Req Update Failed"});
		});
	}

  
}
ManPowerModel.deleteData = (manreqid,result)=>{
   
	getDataByID(manreqid).then((data)=>{
		if(data.length > 0){
			deleteData(manreqid).then(()=>{
				result(null,{status:"success",message:"Manpower Req Deleted Successfully"});
			}).catch((err)=>{
				result(err,{status:"failure",message:"Manpower Req Delete Failed"});
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
                    console.log('Manpower Req Fetch Failed due to '+err);
                    return;
                }
                console.log('Manpower Req Fetched successfully');
				
			
                resolve(data);
            })
    });
}
function getDataByID(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM manpower_req_master WHERE manreqid = ?",[uid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Manpower Req Fetch Failed due to '+err);
                    return;
                }
                console.log('Manpower Req Fetched successfully');
				
			
                resolve(data);
            })
    });
}
function addData(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO manpower_req_master SET ?",[model],(err,data)=>{
                if(err){
                    reject();
                    console.log('Manpower Req Insert Failed due to '+err);
                    return;
                }
                console.log('Manpower Req Inserted successfully');
				
			
                resolve(data.insertId);
            })
    });
}
function updateData(model,manreqid){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE manpower_req_master SET ? WHERE manreqid = ?",[model,manreqid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Manpower Req Updated Failed due to '+err);
                    return;
                }
                console.log('Manpower Req Updated successfully');
				
			
                resolve();
            })
    });
}
function deleteData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM manpower_req_master WHERE manreqid = ?",[uid],(err,data)=>{
                if(err){
                    reject();
                    console.log('Manpower Req Delete Failed due to '+err);
                    return;
                }
                console.log('Manpower Req Delete successfully');
				
			
                resolve();
            })
    });
}





module.exports = ManPowerModel;