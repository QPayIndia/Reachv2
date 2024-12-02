const express = require("express");
const crypto = require('crypto');
const cors = require("cors");
require('dotenv').config();




const { secretKey, ivKey } = require("./app/config/globals.js");
const CustomEncrypt = require("./app/controllers/encrypt.js");
const { start } = require("repl");
const Logger = require("./app/utils/logger.js");
const WebSocket = require('ws');
const Socket = require("./app/utils/socket.js");
const Auth = require("./app/utils/auth.js");
const { env } = require("process");
const { log } = require("console");
const app = express();





app.use(express.json({limit: '200mb'})); 
app.use(express.urlencoded({ extended: false ,limit: '200mb'}));
app.use(cors({ origin: true }));

const validateApiKey = (req, res, next) => {


 
  
  if (req.path === '/api/business/signup' || req.path === '/api/user/verifyotp' || req.path === '/api/usesr/auth' || req.path === '/uploads') {
      return next();
  }else{
   const mode = req.headers['x-agent-mode'];
   const apiKey = req.headers['x-qpay-key'];
   let envKey = "";
   if(mode === "user"){
      envKey = process.env.USER_KEY;
   }else if(mode === "staff"){
      envKey = process.env.USER_KEY;
   }else{
      return res.status(401).json({status:"failure", message: 'Invalid Request - 1' });
   }
 

  if(apiKey == envKey){
    let requestorid = req.body.userid;
  if(!requestorid) return res.status(401).json({status:"failure", message: 'User Id is required' });
  
  let accesstoken = req.body.accesstoken;
  if(!accesstoken) return res.status(401).json({status:"failure", message: 'Access Token is required' });
  

  Auth.ValidateAPIKey(requestorid,accesstoken,(auth,response)=>{
    if(auth){
      next();
    }else{
      return res.status(401).json({status:"failure", message: 'Invalid Request - 2' });
    }
  })
  }else{
    return res.status(401).json({status:"failure", message: 'Invalid Request - 3' });
  }

} 
};



app.use(validateApiKey);

function decryptMiddleware(req, res, next) {
 
const { uid,userid,bid } = req.body;

  if(uid|| userid || bid){
    if (req.body.uid) {
      try {
          const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'),Buffer.from(ivKey, 'hex'));
          let decrypted = decipher.update(req.body.uid, 'hex', 'utf8');
          decrypted += decipher.final('utf8');
          
          // Modify request body with decrypted data
          req.body.uid = decrypted;
         
      } catch (err) {
          // return res.status(400).json({ error: 'Decryption failed' });
          
      }
  }
   if (req.body.userid) {
   
    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'),Buffer.from(ivKey, 'hex'));
        let decrypted = decipher.update(req.body.userid, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        // Modify request body with decrypted data
        req.body.userid = decrypted;
        console.log(decrypted);
        
        
       
    } catch (err) {
        // return res.status(400).json({ error: 'Decryption failed' });
        // console.log(err);
    }
}  
if (req.body.bid) {
  try {
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'),Buffer.from(ivKey, 'hex'));
      let decrypted = decipher.update(req.body.bid, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      // Modify request body with decrypted data
      req.body.bid = decrypted;
  } catch (err) {
      // return res.status(400).json({ error: 'Decryption failed' });
  }
} 
  }
  

  // Proceed to the next middleware or route handler
  next();
}


// app.use(decryptMiddleware);


// app.use((req, res, next) => {
 
//   // Capture the response finish event to log status and response time
//   // res.on('finish', () => {
//   //   const { statusCode } = res;
//   //   const responseTime = Date.now() - startTime;
//   //   console.log(`${method} ${req.body} ${url} ${statusCode} - ${responseTime}ms`);
//   //   console.log('Body:', req.body);
//   // });
//   Logger.LogInfo(req);
//   next();
// });



// app.use((err, req, res, next) => {
//   Logger.LogError(err,req,res);
//   res.status(500).send('Something went wrong!'); // Send a generic error response
// });


 /* bodyParser.urlencoded() is deprecated */

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Reach application." });
});

app.get("/encrypt/:text", (req, res) => {
  const path = req.params.text; 
  try{
    CustomEncrypt.encrypt(path,req,res);
  }catch(err){
    res.send(404).send('404 Not Found');
  }
});




app.get('/uploads/:name', (req, res) => { 
  const imagePath = req.params.name; 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.sendFile("C:/Users/Public/Reach/reach/Reachv2/uploads/"+imagePath); 
});

app.get('/uploads/business/certificates/:name', (req, res) => { 
  const imagePath = req.params.name; 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.sendFile("C:/Users/Public/Reach/reach/Reachv2/uploads/business/certificates/"+imagePath); 
});

app.get('/uploads/business/photo/:name', (req, res) => { 
  const imagePath = req.params.name; 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.sendFile("C:/Users/Public/Reach/reach/Reachv2/uploads/business/photo/"+imagePath); 
});
app.get('/uploads/business/video/:name', (req, res) => { 
  const imagePath = req.params.name; 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.sendFile("C:/Users/Public/Reach/reach/Reachv2/uploads/business/video/"+imagePath); 
});
app.get('/uploads/kyc/:name', (req, res) => { 
  const imagePath = req.params.name; 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.sendFile("C:/Users/Public/Reach/reach/Reachv2/uploads/kyc/"+imagePath); 
});
app.get('/uploads/business/kyb/:name', (req, res) => { 
  const imagePath = req.params.name; 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.sendFile("C:/Users/Public/Reach/reach/Reachv2/uploads/business/kyb/"+imagePath); 
});
app.get('/uploads/chat/file/:name', (req, res) => { 
  const imagePath = req.params.name; 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.sendFile("C:/Users/Public/Reach/reach/Reachv2/uploads/chat/file/"+imagePath); 
});
app.get('/uploads/chat/audio/:name', (req, res) => { 
  const imagePath = req.params.name; 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.sendFile("C:/Users/Public/Reach/reach/Reachv2/uploads/chat/audio/"+imagePath); 
});
app.get('/uploads/chat/video/:name', (req, res) => { 
  const imagePath = req.params.name; 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.sendFile("C:/Users/Public/Reach/reach/Reachv2/uploads/chat/video/"+imagePath); 
});
app.get('/uploads/chat/image/:name', (req, res) => { 
  const imagePath = req.params.name; 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.sendFile("C:/Users/Public/Reach/reach/Reachv2/uploads/chat/image/"+imagePath); 
});

require("./app/routes/businessInfoRoute.js")(app);
require("./app/routes/adminRoute.js")(app);
require("./app/routes/businessListingRoute.js")(app);
require("./app/routes/productDetailRoute.js")(app);
require("./app/routes/businessMasterRoute.js")(app);
require("./app/routes/businessDetailRoute.js")(app);
require('./app/routes/categoryRoute.js')(app);
require('./app/routes/userRoute.js')(app);
require('./app/routes/cartRoute.js')(app);
require('./app/routes/paymentRoute.js')(app);
require('./app/routes/homePageRoute.js')(app);
require('./app/routes/chatRoute.js')(app);
require('./app/routes/staffRoute.js')(app);
require('./app/routes/BillPaymentsRoute.js')(app);
require('./app/routes/audioVideoCallRoute.js')(app);
require('./app/routes/businessReportRoute.js')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});





Socket.InitConnection(server);

sleep(3000).then(()=>{
  Socket.SendMessage(JSON.stringify({message:'Data Send Later'}));
})


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setCorsHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Accept-Language, Content-Language, Content-Type');
  next();
}


