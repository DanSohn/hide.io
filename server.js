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
let db = 'mongodb+srv://dbUser:dbUserPassword@hideio-wic1l.mongodb.net/Game?retryWrites=true&w=majority';
// Connect to mongo
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
// Database models (schema)
const User = require('./models/User');
const Lobby = require('./models/Lobby');


app.use(cors());
app.get('/', (req, res) => {
    res.send("API working properly!");
});

const starting_pos_module = require(__dirname + "/starting_positions");
let starting_pos = starting_pos_module.starting_positions;


// create players object
let players = {};

// create a rooms object to keep track of rooms created
//where the key is the room code to join
let createdrooms = [];
let rooms = {};

console.log("Initial players list: ", players);
io.on('connection', (socket) => {
    // console.log("A User has connected");
    // when a player is logging in through oauth, i cross-check the given info with the database to see
    // if the user already exists (email). If he does, I emit a message to go straight to main menu, otherwise to
    // go to user selection first
    socket.on("user exists check", (email) => {
        User.findOne({email: email})
            .then(user => {
                // if the user exists already in the database
                if(user){
                    console.log("User already exists, -----> main menu");
                    // console.log(user);
                    // emitting the email of the user
                    socket.emit("user database check", user.username);
                }else{
                    console.log("User does not exist, -----> username selection");
                    // emitting an empty string representing false
                    socket.emit("user database check", "");
                }
            })
    });

    socket.on("create user", (info) => {
        // create a new user based on the schema
        const newUser = new User({
            username: info.username,
            email: info.email
        });

        // save the user to mongoDB, returning a promise when it succeeds
        newUser.save()
            .then(user => {
                console.log(user, " has successfully been added to the database");
            })
            .catch(err => console.log(err));
    });

    //Send the rooms that are available when the user clicks play to see the available lobbies
    socket.on("play", () => {
        socket.emit("lobbies", rooms);
    });

    //When player creates a new lobby to play with their friends
    //User creates lobby with a name (no need to be unique), with settings for the game
    // PARAMETERS:
    //          info: an object containing: user email, lobbyname , game mode, game time, game map
    socket.on("create lobby", (info) => {
        console.log("Creating lobby with info ", info);
        let roomID = Math.random().toString(36).slice(2, 8);

        Lobby.findOne({join_code: roomID})
            .then(lobby => {
                if(lobby){
                    console.log("Thats unlucky! Try again!");
                }else{
                    const newLobby = new Lobby({
                        join_code: roomID,
                        creator_email: info.email,
                        lobby_name: info.lobbyName,
                        game_mode: info.gameMode,
                        game_time: info.gameTime,
                        game_map: info.gameMap,
                        creation_date: Date.now()
                    });

                    // save the lobby to mongoDB, returning a promise when it succeeds
                    newLobby.save()
                        .then(lobby => {
                            console.log(lobby, " has successfully been added to the database");
                        })
                        .catch(err => console.log(err));
                }
            });

        console.log("Left");



        /*rooms[roomid] = {};
        rooms.host = playername;
        rooms.players = {}; //Information about each of the players that will join the lobby including the host
        rooms[roomid].roomname = lobbyname;
        rooms.settings = settings;
        createdrooms.push(roomid);*/
        // console.log(createdrooms);
        // console.log(rooms);
    });

    // when a player joins the game, I should provide them with a starting coordinate
    // this is the only place a new player is populated

    // console.log("Creating new player");
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