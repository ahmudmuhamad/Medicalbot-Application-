const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const ws = require('ws');
dotenv.config({path: './config.env' })


const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
     process.env.DATABASE_PASSWORD);


mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(
    con => {
        console.log("DB connected successfully");
    }
);




/*
const wss = new ws.Server({ port: 3001 });


wss.on('connection', (ws) => {
    console.log('New client connected');
  
    ws.on('message', (message) => {
      console.log('Received message:', message.toString());
      ws.send('Server received your message!'); // Send a response
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
  */




const http = require('node:http');
const { Server } = require('socket.io');

const port = 3000;
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`The server is running on port ${port}`); 
});