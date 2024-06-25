const { json } = require('express');
const sql = require('./db.js');

const ContactInfo = function(model){
    this.uid = model.uid,
    this.contactid = model.contactid,
    this.phone = model.phone,
    this.name = model.name,
    this.designation = model.designation,
    this.nameprefix = model.nameprefix,
    this.whatsapp = model.whatsapp,
    this.landline = model.landline,
    this.tollfree = model.tollfree,
    this.email = model.email,
    this.addemail = model.addemail,
    this.createdon = model.createdon,
    this.createdby = model.createdby
}


const OwnerInfo = function(model){
    this.uid = model.uid,
    this.ownerid = model.ownerid,
    this.isprimary = model.isprimary,
    this.nameprefix = model.nameprefix,
    this.name = model.name,
    this.designation = model.designation,
    this.createdon = model.createdon,
    this.createdby = model.createdby
}

const PhoneInfo = function(model){
    this.uid = model.uid,
    this.phoneid = model.phoneid,
    this.phone = model.phone,
    this.isprimary = model.isprimary,
    this.search = model.search,
    this.notification = model.notification,
    this.createdon = model.createdon,
    this.createdby = model.createdby
}

ContactInfo.create = (model,result)=>{
    // sql.query("INSERT INTO contact_info SET ?",model,(err,res)=>{
    //     if(err){
    //         result(err,{status:"success",message:err,data:{}});
    //         console.log('Contact Info Failed due to '+err);
    //         return;
    //     }
    //     console.log('Contact Info Inserted successfully');
    //     result(null,{status:"success",message:"News Inserted Successfully",data:{id:res.insertId}});
    // })

    // var parsedOwner = owners;
    // parsedOwner.forEach(item => {
        
    //     const owner = new OwnerInfo(
    //         {
    //             uid:model.uid,
    //             isprimary:item['isprimary'],
    //             nameprefix:item['name_prefix'],
    //             name:item['name'],
    //             designation:item['designation'],
    //             createdby:model.uid
    //         }
    //     )

       

    //     sql.query("INSERT INTO owner_master SET ?",owner,(err,res)=>{
    //         if(err){
    //             result(err,{status:"success",message:err,data:{}});
    //             console.log('Owner Info Failed due to '+err);
    //             return;
    //         }
    //         console.log('Owner Info Inserted successfully');
    //         // result(null,{status:"success",message:"News Inserted Successfully",data:{id:res.insertId}});
    //     })
    // });

    let contact = false;
    let owner = false;
    let number = false;
    var insertId = 0;

    getContact(model.uid).then((data)=>{
        if(data.length > 0){
            updateContactInfo(model).then((id)=>{
                result(null,{status:"success",message:"Contact Updated Successfully"});
            }).catch(()=>{
                result(null,{status:"failure",message:"Something went wrong"});
            });
        }else{
            addContactInfo(model).then((id)=>{
                result(null,{status:"success",message:"Contact Info Inserted Successfully"});
            }).catch(()=>{
                result(null,{status:"failure",message:"Something went wrong"});
            });
        }
    })

    
    // addOwners(owners,model.uid).then(()=>{
    //     owner = true
    // }).catch(({

    // }));
    
    // addNumbers(numbers,model.uid).then(()=>{
    //     number = true
    // }).catch(({

    // }));
}

function addContactInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO contact_info SET ?",model,(err,res)=>{
                if(err){
                    reject();
                    console.log('Contact Info Failed due to '+err);
                    return;
                }
                console.log('Contact Info Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function updateContactInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE contact_info SET ? WHERE uid = ?",[model,model.uid],(err,res)=>{
                if(err){
                    reject();
                    console.log('Contact Info Failed due to '+err);
                    return;
                }
                console.log('Contact Info updated successfully');
                resolve();
            })
    });
}

function addOwners(owners,userid){
    return new Promise((resolve,reject)=>{
        owners.forEach(item => {

            const owner = new OwnerInfo(
                        {
                            uid:userid,
                            isprimary:item['isprimary'],
                            nameprefix:item['name_prefix'],
                            name:item['name'],
                            designation:item['designation'],
                            createdby:userid
                        }
                    )
            
    
                sql.query("INSERT INTO owner_master SET ?",owner,(err,res)=>{
                if(err){
                    reject();
                    return;
                }
                console.log('Owner Info Inserted successfully');
                resolve();
            })
        });
    });
}

function addNumbers(numbers,userid){
    return new Promise((resolve,reject)=>{
        numbers.forEach(item => {

            const number = new PhoneInfo(
                        {
                            uid:userid,
                            isprimary:item['isprimary'],
                            phone:item['phone'],
                            search:item['search'],
                            notification:item['notification'],
                            createdby:userid
                        }
                    )
            
    
                sql.query("INSERT INTO phone_master SET ?",number,(err,res)=>{
                if(err){
                    reject();
                    return;
                }
                console.log('Phone Info Inserted successfully');
                resolve();
            })
        });
    });
}

function getContact(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM contact_info WHERE uid = ? LIMIT 1",[uid],(err,data)=>{
            if(err){
                result(err,{status:"failure",message:err,data:{}});
                
                return;
            }
            resolve(data);
    })
    })
}

ContactInfo.getData = (uid,result)=>{
    var psData = {};
    //SELECT * FROM contact_info as A,owner_master as B WHERE A.uid = B.uid AND B.isprimary = 1 and A.uid = ? LIMIT 1
    sql.query("SELECT * FROM contact_info WHERE uid = ? LIMIT 1",[uid],(err,data)=>{
        if(err){
            result(err,{status:"failure",message:err,data:{}});
            
            return;
        }
       
        psData['binfo'] = data;

        getNumbers(uid).then((numbers)=>{
           
            psData['numbers'] = numbers;
            getOwners(uid).then((owners)=>{
                psData['owners'] = owners;
                result(null,{status:"success",message:"News Fetched Successfully",data:psData});

            })
        
        });

       
        
    })

    
}


function getNumbers(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM phone_master WHERE uid = ?",[uid],(err,data)=>{
            if(err){
                
                return;
            }
    
            resolve(data)
        })
    
        
    
    });
}
function getOwners(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM owner_master WHERE uid = ?",[uid],(err,data)=>{
            if(err){
                
                return;
            }
    
            resolve(data)
        })
    
        
    
    });
}




module.exports = ContactInfo;