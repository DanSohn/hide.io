const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const socket_io = require('socket.io');
const io = socket_io.listen(server);
const cors = require('cors');


const port = process.env.PORT || 3001;

app.use(cors());
app.get('/', (req, res) => {
    res.send("API working properly!");
});

const starting_pos_module = require(__dirname + "/starting_positions");
let starting_pos = starting_pos_module.starting_positions;

/*
app.use('/src', express.static(__dirname + '\\src'));// Routing
console.log(__dirname + '\\src');

//app.use('/static', express.static(__dirname + '/src'));// Routing
//app.use('/public', express.static(__dirname + "\\public"));
console.log(__dirname + '\\src');
app.get('/', function(req, res) {
    res.send("API working properly");
    //res.sendFile(path.join(__dirname, '\\public\\index.html'));
});

 */


// create players object
let players = {};

io.on('connection', (socket) => {
    console.log("A User has connected");

    // when a player joins the game, I should provide them with a starting coordinate
    // this is the only place a new player is populated

    console.log("Creating new player");
    let x;
    let y;
    // run through the starting positions, and set the first unused one to the player.
    // then set those positions to be in use
    for (let i = 0; i < starting_pos.length; i++) {
        if (starting_pos[i].use === false) {
            x = starting_pos[i].x;
            y = starting_pos[i].y;
            starting_pos[i].use = true;
            break;
        }
    }

    players[socket.id] = {
        x: x,
        y: y
    };


    /* console.log(players[socket.id]);
     console.log("players ...  ", players);

     console.log("number of players rn ", numPlayers.length);*/

    // emit the number of current sockets connected
    let players_arr = Object.keys(players);
    io.emit("Number of players", players_arr.length);
    console.log("Passing in players", players);
    io.emit("players list", players);

    // upon a player movement event, i will update the players array object with their new positions, and
    // emit a event to redraw the new positions
    socket.on("Player movement", (position) => {
        // console.log("Server logging player movement");
        // console.log("Receiving player movement event from client");

        players[socket.id] = {
            x: position[0],
            y: position[1]
        };

        // sends a broadcast to ALL sockets with the players and their positions
        // console.log("Sending to clients to redraw positions");
        io.emit("Redraw positions", players);
    });

    socket.on("lobby start timer", (timer) => {
        let countdown = Math.floor(timer/1000);
        // send to all sockets an event every second
        let timerID = setInterval(() => {
            console.log(countdown);
            countdown--;
            io.emit("lobby current timer", countdown);
        }, 1000);

        // after the timer amount of seconds (default 5), stop emitting
        setTimeout(() =>{
            clearInterval(timerID)
        }, timer);

    });
    socket.on("disconnect", () => {
        delete players[socket.id];
        let players_arr = Object.keys(players);
        io.emit("Number of players", players_arr.length);
    });
});

/*
// this is how often I am emitting the state of the players (position)
setInterval(()=>{
   io.sockets.emit("state", players);
}, 1000/20);
*/

// our http server listens to port 4000
server.listen(port, (err) => {
    if (err) throw err;
    console.log('listening on *:' + port);
});