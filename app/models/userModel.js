const sql = require('./db.js');

const User = function(model){
    this.userid = model.userid,
    this.username = model.username,
    this.password = model.password,
    this.timestamp = model.timestamp,
    this.createdby = model.createdby
}

User.login = (model,result)=>{
    sql.query("SELECT COUNT(*) as count,username,password,userid FROM users WHERE username = ?",[model.username],(err,results)=>{
        if(err){
            
            console.log('Cannot find Player due to '+err);
            return;
        }
        if(results[0]['password'] == "" || results[0]['password'] == null){
            result(null,{status:"failure",message:"User doesn't exist"});
        }
        else if(results[0]['password'] != model.password){
            result(null,{status:"failure",message:"Password doen't match"});
        }else{
            result(null,{status:"success",message:"Authentication Successful",data:{id:results[0]['userid']}});
        }
    })
    
}

User.add = (username,password,result)=>{
    
    sql.query("INSERT INTO users SET username = ? , createdby = ?",[username,0],(err,res)=>{
        if(err){
            result(null,{status:"failure",message:"Something went wrong!"});
            console.log('Team Created Failer due to '+err);
            return;
        }
        console.log('User Created successfully');
        result(null,{status:"success",message:"Authentication Successful",data:{id:res.insertId}});
    })
}





module.exports = User;