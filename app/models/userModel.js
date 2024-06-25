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
            result(err,null);
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

User.add = (username,result)=>{
    
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

// User.addPlayerAndAddIntoTeam = (player,teamid,result)=>{
    
//     checkPlayerExistsinPlayerMaster(player.phone).then(([exists,pid])=>{
        
//         if(!exists){
//             User.create(player,(err,pdata)=>{
//                 if(err){
//                     console.log("Player Cannot be created");
//                     result(err,{message: "Player not created"})
//                 }else{
//                     console.log(pdata);
//                     User.addTeamPlayer(pdata.id,teamid,(err,tdata)=>{
//                             if(err){
//                                 console.log("Player Cannot be added to the team");
//                                 result(err,{message: "Player not added to the team"})
//                             }else{
//                                 console.log(tdata)
//                                 result(null,{id:tdata.id,player});
//                             }
//                         })
                        
//                 }
//             })
//         }
        
//     else{
//         console.log("Player already exists")
//         checkPlayerExistsinTeamMaster(pid).then((exists)=>{
//             if(!exists)  {
//                 User.addTeamPlayer(pid,teamid,(err,tdata)=>{
//                     if(err){
//                         console.log("Player Cannot be added to the team");
//                         result(err,{message: "Player not added to the team"})
//                     }else{
//                         console.log(tdata)
//                         result(null,{id:tdata.id,player});
//                     }
//                 })
//             }
//               else{
//                 console.log("Player already in the team");
//                   result(null,{message : "Player already in the team"})
//               }
                    
//           }).catch((err)=>{
//             result(null,{message:err});
//           });
//     }
    
//     }).catch((err)=>{
//         result(null,{message:err})
//     });
    
// }


// User.getTeamPlayers = (teamId,result)=>{
//     sql.query("SELECT DISTINCT player_master.id,player_master.name FROM team_players,player_master WHERE player_master.id = team_players.playerid and team_players.teamid = ?",[teamId],(err,rows)=>{
//         if(err){
//             result(err,null);
            
//             return;
//         }
        
//         result(null,rows);
//     })
// }


// function checkPlayerExistsinPlayerMaster(phone) {
//     return new Promise((resolve, reject) => {
//       const query = 'SELECT COUNT(*) AS count,id FROM player_master WHERE phone = ?';
//       sql.query(query, [phone], (err, results) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//         const count = results[0].count;
//         const pid = results[0].id;
        
//         resolve([count > 0,pid]);
//       });
//     });
//   }
// function checkPlayerExistsinTeamMaster(id) {
//     return new Promise((resolve, reject) => {
//       const query = 'SELECT COUNT(*) AS count FROM team_players WHERE playerid = ?';
//       sql.query(query, [id], (err, results) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//         const count = results[0].count;
//         resolve(count > 0);
//       });
//     });
//   }
//   function createPlayer(player){
//     return new Promise((resolve,reject)=> {
//         const query = 'INSERT INTO player_master SET ?';
//         sql.query(query, [player], (err, res) => {
//             if(err){
//                 reject(err);
//                 console.log('Player Created Failer due to '+err);
//                 return;
//             }
//             console.log('Player Created successfully');
//             resolve([null,{id:res.insertId,name:player.name,phone:player.phone}]);
//         });
//     });
//   }



module.exports = User;