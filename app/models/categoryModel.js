const sql = require('./db.js');

const Category = function(model){
    this.categoryid = model.id,
    this.title = model.title,
    this.createdby = model.createdby
    
}

Category.create = (model,result)=>{
    sql.query("INSERT INTO category SET ?",model,(err,res)=>{
        if(err){
            result(err,null);
            console.log('Category Created Failer due to '+err);
            return;
        }
        console.log('Category Created successfully');
        sql.query("SELECT * FROM category ",(err,rows)=>{
            if(err){
                result(err,{status:"sucess",message:"err"});
                
                return;
            }
            
            result(null,{status:"success",message:"Category Created Successfully",data:{categories:rows}});
        })
        
    })
   
}
Category.delete = (id,result)=>{
    sql.query("DELETE FROM category WHERE categoryid = ?",[id],(err,res)=>{
        if(err){
            result(err,{status:"failure",message:err,data:{}});
            return;
        }

       
        
        result(null,{status:"success",message:"Category Deleted Successfully",data:{}});
    })
}






Category.getAll = (result)=>{
    sql.query("SELECT * FROM category ",(err,rows)=>{
        if(err){
            result(err,{status:"sucess",message:"err"});
            
            return;
        }
        
        result(null,{status:"sucess",message:"Data Fetched Successfully",data: {categories:rows}});
    })
}


function checkPlayerExistsinPlayerMaster(phone) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) AS count,id FROM player_master WHERE phone = ?';
      sql.query(query, [phone], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        const count = results[0].count;
        const pid = results[0].id;
        
        resolve([count > 0,pid]);
      });
    });
  }
function checkPlayerExistsinTeamMaster(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) AS count FROM team_players WHERE playerid = ?';
      sql.query(query, [id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        const count = results[0].count;
        resolve(count > 0);
      });
    });
  }
  function createPlayer(player){
    return new Promise((resolve,reject)=> {
        const query = 'INSERT INTO player_master SET ?';
        sql.query(query, [player], (err, res) => {
            if(err){
                reject(err);
                console.log('Player Created Failer due to '+err);
                return;
            }
            console.log('Player Created successfully');
            resolve([null,{id:res.insertId,name:player.name,phone:player.phone}]);
        });
    });
  }



module.exports = Category;