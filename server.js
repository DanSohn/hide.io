const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socket_io = require('socket.io');
const io = socket_io(server);

const port = process.env.PORT || 4000;
// create players object
let players = {};
io.on('connection', (socket) => {
    console.log("A User has connected");

    // when a player joins the game, I should provide them with a starting coordinate
    socket.on('new player', () => {
        players[socket.id] = {
            x: 300,
            y: 300
        };
    });

    // my movement_obj is an object with 4 keys: left, right, up, down. All are booleans
    socket.on('movement', (movement_obj) =>{
        let player = players[socket.id];

        if(movement_obj.left){
            player.x -= 5;
        }
        if(movement_obj.right){
            player.x += 5;
        }
        if(movement_obj.up){
            player.y -= 5;
        }
        if(movement_obj.down){
            player.y += 5;
        }

    });
});

// this is how often I am emitting the state of the players (position)
setInterval(()=>{
   io.sockets.emit("state", players);
}, 1000/5);


// our http server listens to port 4000
server.listen(PORT, (err) => {
    if (err) throw err;
    console.log('listening on *:' + PORT);
});