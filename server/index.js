const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081});

wss.on("connection", ws => {
    console.log('new client');
   
    ws.on("close", () => {
        console.log("Client has disconnected");
    })
    
})

