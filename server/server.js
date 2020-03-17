const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const socket_io = require('socket.io');
const io = socket_io.listen(server);
const cors = require('cors');
const port = process.env.PORT || 3001;

const mongoose = require('mongoose');
//set up the default connection
let db = 'mongodb+srv://dbUser:dbUserPassword@hideio-wic1l.mongodb.net/Players?retryWrites=true&w=majority';
// Connect to mongo
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
// the Users model (schema)
const User = require('./models/User');

app.use(cors());
app.get('/', (req, res) => {
    res.send("API working properly!");
});

const starting_pos_module = require(__dirname + "/starting_positions");
let starting_pos = starting_pos_module.starting_positions;


// create players object
let players = {};
console.log("Initial players list: ", players);
io.on('connection', (socket) => {
    console.log("A User has connected");

    // when a player is logging in through oauth, i cross-check the given info with the database to see
    // if the user already exists (email). If he does, I emit a message to go straight to main menu, otherwise to
    // go to user selection first
    socket.on("user exist check", (email) => {
        User.findOne({email: email})
            .then(user => {
                // if the user exists already in the database
                if(user){
                    console.log("User already exists, -----> main menu");
                    // emitting the boolean true, as in, they do exist
                    socket.emit("user database check", true);
                }else{
                    console.log("User does not exist, -----> username selection");
                    // emitting the boolean false, as in, they don't exist
                    socket.emit("user database check", false)
                }
            })
    });

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




    // emit the number of current sockets connected
    let players_arr = Object.keys(players);
    socket.on("player joined", () =>{
        io.emit("Number of players", players_arr.length);
        console.log("Passing in players", players);
        io.emit("players list", players);
    });


    // upon a player movement event, i will update the players array object with their new positions, and
    // emit a event to redraw the new positions
    socket.on("Player movement", (position) => {
        console.log("Logging movement, recieved: ", position);
        // console.log("Receiving player movement event from client");

        console.log("original position", players[socket.id].x, players[socket.id].y);

        players[socket.id] = {
            x: position[0],
            y: position[1]
        };

        console.log("next position", players[socket.id].x, players[socket.id].y);

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

// our http server listens to port 4000
server.listen(port, (err) => {
    if (err) throw err;
    console.log('listening on *:' + port);
});