const sql = require('./db.js');

const Bookmark = function(model){
    this.bookmarkid = model.bookmarkid,
    this.tempid = model.tempid,
    this.newsid = model.newsid,
    this.timestamp = model.timestamp
    
}

Bookmark.create = (newPlayer,result)=>{
    // sql.query("INSERT INTO player_master SET ?",newPlayer,(err,res)=>{
    //     if(err){
    //         result(err,null);
    //         console.log('Player Created Failer due to '+err);
    //         return;
    //     }
    //     console.log('Player Created successfully');
    //     result(null,{id:res.insertId,name:newPlayer.name,phone:newPlayer.phone});
    // })
    createPlayer(newPlayer).then(([err,data])=>{
        result(err,data);
    }).catch((err)=>{
        result(err,null);
    })
}

Bookmark.addTeamPlayer = (playerid,teamid,result)=>{
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

Bookmark.addPlayerAndAddIntoTeam = (player,teamid,result)=>{
    
    checkPlayerExistsinPlayerMaster(player.phone).then(([exists,pid])=>{
        
        if(!exists){
            Bookmark.create(player,(err,pdata)=>{
                if(err){
                    console.log("Player Cannot be created");
                    result(err,{message: "Player not created"})
                }else{
                    console.log(pdata);
                    Bookmark.addTeamPlayer(pdata.id,teamid,(err,tdata)=>{
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
                Bookmark.addTeamPlayer(pid,teamid,(err,tdata)=>{
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


Bookmark.getTeamPlayers = (teamId,result)=>{
    sql.query("SELECT DISTINCT player_master.id,player_master.name FROM team_players,player_master WHERE player_master.id = team_players.playerid and team_players.teamid = ?",[teamId],(err,rows)=>{
        if(err){
            result(err,null);
            
            return;
        }
        
        result(null,rows);
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



module.exports = Bookmark;