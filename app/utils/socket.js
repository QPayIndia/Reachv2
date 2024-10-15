const WebSocket = require('ws');

const Socket = function(model){}
// const ws = new WebSocket('ws://localhost:8080');
let wss = null;
let clients = new Map();
Socket.InitConnection = (server)=>{

  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  
  ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

  
  ws.on('message', (message) => {
    console.log('Received message:', message.toString());
    if(safeJsonParse(message)){
      let data = safeJsonParse(message);
     if('userid' in data){
      clients.set(data.userid, ws);
      console.log("User Added to Map with "+data.userid);
      ws.send(JSON.stringify({ message: 'User Added to Map' }));
     } 
    }
   
    

  });

  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

});

// // When the connection is open
// ws.on('open', function open() {
//     console.log('Connected to the WebSocket server');
//     ws.send('Hello from the client!');
//   });
}

Socket.SendMessage=(message)=>{
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
    
}
Socket.SendMessageByUserId=(userid,type,data,message)=>{
    
    // ws.send(JSON.stringify({userid:userid,type:type,data:data,message:message}));
    const client = clients.get(userid);
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({userid:userid,type:type,data:data,message:message}));
      }
 
}

function safeJsonParse(jsonString) {
  try {
    const parsedObject = JSON.parse(jsonString);
    return parsedObject;
  } catch (error) {
    console.error("Invalid JSON:", error);
    return null; // Return null or handle the error as needed
  }
}

module.exports = Socket;