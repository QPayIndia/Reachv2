const { json } = require('express');
const sql = require('./db.js');


const BusinessTimings = function(model){
    this.uid = model.uid,
    
    this.monfrom = model.monfrom,
    this.monto = model.monto,
    this.tuefrom = model.tuefrom,
    this.tueto = model.tueto,
    this.wedfrom = model.wedfrom,
    this.wedto = model.wedto,
    this.thurfrom = model.thurfrom,
    this.thurto = model.thurto,
    this.frifrom = model.frifrom,
    this.frito = model.frito,
    this.satfrom = model.satfrom,
    this.satto = model.satto,
    this.sunfrom = model.sunfrom,
    this.sunto = model.sunto,
    this.createdby = model.uid
    // this.createdon = model.createdon
}


BusinessTimings.addTimings = (model,result)=>{
   
    getBusinessTimings(model.uid).then((data)=>{
        if(data.length > 0){
            console.log("Info Already present")
            updateTimings(model).then((id)=>{
                result(null,{status:"success",message:"Business Timings Updated Successfully",data:id});
            }).catch(({
        
            }));
        }else{
            addTimings(model).then((id)=>{
                result(null,{status:"success",message:"Business Timings Inserted Successfully",data:id});
            }).catch(({
        
            }));
        }
    })
    
    
    
}



function addTimings(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO business_timings SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Business Info Failed due to '+err);
                    return;
                }
                console.log('Business Timings Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function updateTimings(model){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE business_timings SET ? WHERE uid = ?",[model,model.uid],(err,res)=>{
                if(err){
                    
                    console.log('Business Timings Failed due to '+err);
                    return;
                }
                console.log('Business Timings Updated successfully');
                resolve(res.insertId);
            })
    });
}


function getBusinessTimings(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM business_timings WHERE uid = ? LIMIT 1",[uid],(err,data)=>{
            if(err){
                reject();
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}




module.exports = BusinessTimings;