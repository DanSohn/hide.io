const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const socket_io = require('socket.io');
const io = socket_io(server);

const port = process.env.PORT || 3000;

app.use('/static', express.static(__dirname + '/static'));// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});


// create players object
let players = {};
io.on('connection', (socket) => {
    console.log("A User has connected");

    socket.emit('hello');

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
            player.x -= 10;
        }
        if(movement_obj.right){
            player.x += 10;
        }
        if(movement_obj.up){
            player.y -= 10;
        }
        if(movement_obj.down){
            player.y += 10;
        }

    });
});

// this is how often I am emitting the state of the players (position)
setInterval(()=>{
   io.sockets.emit("state", players);
}, 1000/20);


// our http server listens to port 4000
server.listen(port, (err) => {
    if (err) throw err;
    console.log('listening on *:' + port);
});