const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socket_io = require('socket.io');
const io = socket_io(server);

const port = process.env.PORT || 4000;


io.on('connection', (socket) => {
    console.log("A User has connected");
});


// our http server listens to port 4000
server.listen(PORT, (err) => {
    if (err) throw err;
    console.log('listening on *:' + PORT);
});