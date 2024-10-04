const winston = require('winston');
require('winston-daily-rotate-file');

const Logger = function(model){

}
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
Logger.LogInfo=(req,res) =>{
    logger.info(`Method: ${req.method} URL: ${req.url} Body: ${JSON.stringify(req.body)} Time: ${formatDate()}\n<-------------------------------------------------->`);
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


module.exports = Logger;