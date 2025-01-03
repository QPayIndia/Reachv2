const winston = require('winston');
require('winston-daily-rotate-file');
const sql = require('../models/db.js');
const Logger = function(model){

}

Logger.LogInfo=(req,res) =>{
   
    const transport = new winston.transports.DailyRotateFile({
        filename: 'logs/application-%DATE%.log',  // Log filename with date
        datePattern: 'YYYY-MM-DD',                // Date pattern for file names
        zippedArchive: true,                      // Optionally compress logs
        maxSize: '20m',                           // Max size of each log file
        maxFiles: '14d'                           // Keep logs for 14 days
      });
      
      // Create a Winston logger
      const logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
          }),
          winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
          })
        ),
        transports: [transport]                   // Add the daily rotating file transport
      });
    logger.info(`Method: ${req.method} URL: ${req.url} Body: ${JSON.stringify(req.body)} Time: ${formatDate()}\n<-------------------------------------------------->`);
}

Logger.LogError=(userid,message)=>{

  _insertError(userid,message);

    // const transport = new winston.transports.DailyRotateFile({
    //     filename: 'logs/error/error-%DATE%.log',  // Log filename with date
    //     datePattern: 'YYYY-MM-DD',                // Date pattern for file names
    //     zippedArchive: true,                      // Optionally compress logs
    //     maxSize: '20m',                           // Max size of each log file
    //     maxFiles: '14d'                           // Keep logs for 14 days
    //   });
    // const logger = winston.createLogger({
    //     level: 'error',
    //     format: winston.format.combine(
    //         winston.format.timestamp({
    //             format: 'YYYY-MM-DD HH:mm:ss'
    //           }),
    //           winston.format.printf(({ timestamp, level, message }) => {
    //             return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    //           })
    //     ),
    //     transports: [
    //         transport
    //     ]
    // });
    
    

    // logger.error(`Method: ${req.method} URL: ${req.url} Body: ${JSON.stringify(req.body)} \nError occurred: ${err.message}\n<-------------------------------------------------->`);
    
}

function formatDate() {
    const date = new Date(Date.now());
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }


  
function _insertError(userid,message){
  return new Promise((resolve,reject)=>{
      sql.query("INSERT INTO error_log_master SET userid = ?,message = ?,status = 'ERROR'",[userid,message],(err,data)=>{
          if(err){
              console.log("Error Insert Failed : "+err);
              reject(err);
              return;
          }
         console.log("Error Inserted Successfully");
         resolve();
  
         
          
      })
  })
}

module.exports = Logger;