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
    console.log(model)
	if(manreqid == 0){
		addData(model).then((id)=>{
			result(null,{status:"success",message:"Manpower Req Inserted Successfully",manreqid:id});
		});
		   
	}

  
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
function addData(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO manpower_req_master SET ?",[model],(err,data)=>{
                if(err){
                    reject();
                    console.log('Manpower Req Fetch Failed due to '+err);
                    return;
                }
                console.log('Manpower Req Fetched successfully');
				
			
                resolve(data.insertId);
            })
    });
}





module.exports = ManPowerModel;