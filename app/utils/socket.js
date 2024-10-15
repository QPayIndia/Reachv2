const WebSocket = require('ws');

const Socket = function(model){}
// const ws = new WebSocket('ws://localhost:8080');
let wss = null;
Socket.InitConnection = (server)=>{

  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  
  ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

  
  ws.on('message', (message) => {
    console.log('Received message:', message.toString());
    
    

  });

  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

});

// When the connection is open
ws.on('open', function open() {
    console.log('Connected to the WebSocket server');
    ws.send('Hello from the client!');
  });
}

Socket.SendMessage=(message)=>{
  wss.clients.forEach(client => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
    
}
Socket.SendMessageByUserId=(userid,type,data,message)=>{
    
    // ws.send(JSON.stringify({userid:userid,type:type,data:data,message:message}));
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({userid:userid,type:type,data:data,message:message}));
      }
    });
}

module.exports = Socket;