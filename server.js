const express = require('express');
const app = express();
const path = require('path');
const dbUtil = require('./dbUtils');
// const server = require('http').createServer(app);
//const socket_io = require('socket.io');
//const io = socket_io.listen(server);
const cors = require('cors');
const port = process.env.PORT || 3001;

let socket = require('socket.io')

// our http server listens to port 4000
server = app.listen(port, (err) => {
    if (err) throw err;
    console.log('listening on *:' + port);
});
io = socket(server)


app.use(cors());
app.get('/', (req, res) => {
    res.send("API working properly!");
});

const starting_pos_module = require(__dirname + "/starting_positions");
let starting_pos = starting_pos_module.starting_positions;


// create players object
let players = {};

// create a rooms object to keep track of rooms and the players inside each room
// key equals room_id (join code)
let rooms_playerlist = {};

console.log("Initial players list: ", players);
io.on('connection', (socket) => {
    // console.log("A User has connected");
    // when a player is logging in through oauth, i cross-check the given info with the database to see
    // if the user already exists (email). If he does, I emit a message to go straight to main menu, otherwise to
    // go to user selection first
    socket.on("user exists check", (email) => {
        dbUtil.getUser(email)
            .then((user) => {
                console.log("recieved from dbutils ", user);
                if(user !== null){
                    socket.emit("user database check", user.username);
                }else{
                    socket.emit("user database check", null);
                }
            });
    });

    socket.on("create user", (info) => {
        dbUtil.createUser(info)
            .then((res)=>{
                if(!res){
                    console.log("Did not provide all information. Try again");
                }
            });
    });

    //Send the rooms that are available when the user clicks play to see the available lobbies
    // it will find all the lobbies in database, and once its done, it will send the collection to the socket
    socket.on("please give lobbies", () => {
        // console.log("Searching for the lobbies in the database");
        dbUtil.getLobbies()
            .then((lobbies) => {
                // console.log("Lobbies found: ", lobbies);

                socket.emit("receive lobby list", lobbies);

            });
    });

    //When player creates a new lobby to play with their friends
    //User creates lobby with a name (no need to be unique), with settings for the game
    // PARAMETERS:
    //          info: an object containing: user email, lobbyname , game mode, game time, game map
    socket.on("create lobby", (info) => {
        console.log("Creating lobby with info ", info);
        let roomID = Math.random().toString(36).slice(2, 8);

        dbUtil.getLobby(roomID)
            .then(lobby =>{
               if(!lobby){
                   dbUtil.createLobby(roomID, info)
                       .then(()=>{
                           /*this here is for those who are viewing the lobbies
                            this new lobby should automatically load for them, so for all the sockets, if they're
                            in the lobby screen, they'll receieve this event and update the lobbies
                            its down inside this promise of adding to database, because i need to find
                            AFTER THE DATABASE IS UPDATED*/
                           dbUtil.getLobbies()
                               .then((lobbies) => {
                                   console.log("emitting ALL LOBBIES ", lobbies);
                                   io.emit("receive lobby list", lobbies);
                               });

                           // creating the lobby player list
                           rooms_playerlist[roomID] = new Set([info.name]);
                           console.log("added to playerlist", roomID, rooms_playerlist);
                       })
               }
            });



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


    /* TODO: Convert the player object into info received from the socket
     Player should press the join button / or create a lobby button in the client
     Doing so will then take you to the room component. In addition, the user will call a socket event
     that will add him to the room_playerlist object, with the lobby roomid as the key, and his name as one of the
     values. It should be a SET that contains the players in the list

     In the room component, whenever someone joins, it will receive an updated players list, which it will then
     use to update its state, that will contain all the players inside.

     */

    // this is the event when i'm joining a lobby and moving to the room component
    // info: code : the join code. email : user's email. username: user's name
    socket.on("join certain lobby", (info) => {
        console.log("all lobbies:", rooms_playerlist);
        console.log("lobby trying to join ... ", rooms_playerlist[info.code]);

        rooms_playerlist[info.code].add(info.username);
        console.log("update lobby list", rooms_playerlist[info.code]);
        io.emit("update lobby list", rooms_playerlist[info.code]);

    });

    // emit the number of current sockets connected

    /*let players_arr = Object.keys(players);
    socket.on("player joined", () =>{
        io.emit("Number of players", players_arr.length);
        console.log("Passing in players", players);
        io.emit("players list", players);
    });*/


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


