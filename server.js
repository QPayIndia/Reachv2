const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8080"
};

//app.use(cors(corsOptions));
//app.use(setCorsHeaders);
app.use(cors({ origin: true }));

// parse requests of content-type - application/json
app.use(express.json({limit: '200mb'})); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false ,limit: '200mb'})); /* bodyParser.urlencoded() is deprecated */

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
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

require("./app/routes/businessInfoRoute.js")(app);
require("./app/routes/businessListingRoute.js")(app);
require("./app/routes/businessMasterRoute.js")(app);
require("./app/routes/businessDetailRoute.js")(app);
require('./app/routes/categoryRoute.js')(app);
require('./app/routes/likeRoute.js')(app);
require('./app/routes/userRoute.js')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function setCorsHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Accept-Language, Content-Language, Content-Type');
  next();
}
