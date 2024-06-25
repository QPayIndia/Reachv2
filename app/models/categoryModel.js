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

Category.addTeamPlayer = (playerid,teamid,result)=>{
    sql.query("INSERT INTO team_players SET playerid = ? , teamid = ?",[playerid,teamid],(err,res)=>{
        if(err){
            result(err,null);
            console.log('Team Created Failer due to '+err);
            return;
        }
        console.log('Player Created successfully');
        result(null,{id:res.insertId});
    })
}

Category.addPlayerAndAddIntoTeam = (player,teamid,result)=>{
    
    checkPlayerExistsinPlayerMaster(player.phone).then(([exists,pid])=>{
        
        if(!exists){
            Category.create(player,(err,pdata)=>{
                if(err){
                    console.log("Player Cannot be created");
                    result(err,{message: "Player not created"})
                }else{
                    console.log(pdata);
                    Category.addTeamPlayer(pdata.id,teamid,(err,tdata)=>{
                            if(err){
                                console.log("Player Cannot be added to the team");
                                result(err,{message: "Player not added to the team"})
                            }else{
                                console.log(tdata)
                                result(null,{id:tdata.id,player});
                            }
                        })
                        
                }
            })
        }
        
    else{
        console.log("Player already exists")
        checkPlayerExistsinTeamMaster(pid).then((exists)=>{
            if(!exists)  {
                Category.addTeamPlayer(pid,teamid,(err,tdata)=>{
                    if(err){
                        console.log("Player Cannot be added to the team");
                        result(err,{message: "Player not added to the team"})
                    }else{
                        console.log(tdata)
                        result(null,{id:tdata.id,player});
                    }
                })
            }
              else{
                console.log("Player already in the team");
                  result(null,{message : "Player already in the team"})
              }
                    
          }).catch((err)=>{
            result(null,{message:err});
          });
    }
    
    }).catch((err)=>{
        result(null,{message:err})
    });
    
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