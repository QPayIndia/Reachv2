const { json } = require('express');
const sql = require('./db.js');

const SocailMedia = function(model){
    this.uid = model.uid,
    // this.socialid = model.socialid,
    this.website = model.website,
    this.instagram = model.instagram,
    this.facebook = model.facebook,
    this.youtube = model.youtube,
    this.twitter = model.twitter,
    this.createdby = model.createdby
    // this.createdon = model.createdon
}



SocailMedia.create = (model,result)=>{
   
    getSocialData(model.uid).then((data)=>{
        if(data.length > 0){
            console.log("Info Already present")
            updateSocialInfo(model).then((id)=>{
                result(null,{status:"success",message:"Social Media Updated Successfully",data:id});
            }).catch(({
        
            }));
        }else{
            addSocialInfo(model).then((id)=>{
                result(null,{status:"success",message:"Social Media Inserted Successfully",data:id});
            }).catch(({
        
            }));
        }
    })
    
    
    
}

function addSocialInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO social_media SET ?",model,(err,res)=>{
                if(err){
                    
                    console.log('Social Media Info Failed due to '+err);
                    return;
                }
                console.log('Social Media Info Inserted successfully');
                resolve(res.insertId);
            })
    });
}
function updateSocialInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("UPDATE social_media SET ? WHERE uid = ?",[model,model.uid],(err,res)=>{
                if(err){
                    
                    console.log('Social Media Info Failed due to '+err);
                    return;
                }
                console.log('Social Media Info Updated successfully');
                resolve(res.insertId);
            })
    });
}



SocailMedia.getData = (uid,result)=>{
    
    getSocialData(uid).then((data)=>{
        result(null,{status:"success",message:"Social Media Info Fetched Successfully",data:data[0]});
    })

    
}

function getSocialData(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM social_media WHERE uid = ? LIMIT 1",[uid],(err,data)=>{
            if(err){
                result(err,{status:"failure",message:err,data:{}});
                
                return;
            }
    
    
            resolve(data);
    
            
    
           
            
        })
    })
}



module.exports = SocailMedia;