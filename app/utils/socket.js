const WebSocket = require('ws');

const Socket = function(model){}
const ws = new WebSocket('ws://localhost:8080');
Socket.InitConnection = ()=>{
// When the connection is open
ws.on('open', function open() {
    console.log('Connected to the WebSocket server');
    ws.send('Hello from the client!');
  });
}

Socket.SendMessage=(message)=>{
    
    ws.send(message);



}

module.exports = Socket;