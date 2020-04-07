const express = require('express');
const path = require('path');
const dbUtil = require('./dbUtils');
//const server = require('http').createServer(app);
const PORT = process.env.PORT || 3001;

const cors = require('cors');
//const io = require('socket.io').listen(server);
const socket = require('socket.io')
// const io = socket(server);
// const server = app.listen(process.env.PORT || 3000);
// const io = require('socket.io').listen(server);
// io.set( "origins", "*:*" );

let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);

server.listen(PORT);

app.use(cors());
app.get('/', (req, res) => {
    res.send("API working properly!");
});

const starting_pos_module = require(__dirname + "/starting_positions");
let starting_pos = starting_pos_module.starting_positions;
const gameMap = starting_pos_module.map;

// create players object
let players = {};
// console.log("Initial players list: ", players);

let rooms_playerlist = roomPlayerList();
// create a rooms object to keep track of rooms and the players inside each room
// key equals room_id (join code)
async function roomPlayerList(){
    await dbUtil.getLobbyCodes()
        .then(lobbies => {
            rooms_playerlist = lobbies;
            console.log("rooms player list", rooms_playerlist);
        });
}


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
        console.log("Searching for the lobbies in the database ---> socket event please give lobbies");

        // from the rooms playerlist object get the number of keys
        // let num_players = Object.keys(rooms_playerlist[roomID]).length;
        // res["num_players"] = num_players;

        dbUtil.getLobbies()
            .then((lobbies) => {
                // console.log("Current rooms playerlist", rooms_playerlist);
                // iterate through every object lobby, and add the property of number of players
                for(let i = 0, len = lobbies.length; i < len; i ++){
                    lobbies[i].num_players = Object.keys(rooms_playerlist[lobbies[i]["join_code"]]).length;
                }

                // console.log("New lobbies:", lobbies);
                io.emit("receive lobby list", lobbies);

            });
    });

    //When player creates a new lobby to play with their friends
    //User creates lobby with a name (no need to be unique), with settings for the game
    // PARAMETERS:
    //          info: an object containing: email, name, lobbyName, gameMode, gameTime, gameMap
    socket.on("create lobby", (info) => {
        // console.log("Creating lobby with info ", info);
        let roomID = Math.random().toString(36).slice(2, 8);

        dbUtil.getLobby(roomID)
            .then(lobby =>{
               if(!lobby){
                   dbUtil.createLobby(roomID, info)
                       .then(()=>{
                           // after lobby is created, I return the join code of it
                           socket.emit("created lobby return code", roomID);
                           /*this here is for those who are viewing the lobbies
                            this new lobby should automatically load for them, so for all the sockets, if they're
                            in the lobby screen, they'll receieve this event and update the lobbies
                            its down inside this promise of adding to database, because i need to find
                            AFTER THE DATABASE IS UPDATED*/
                           dbUtil.getLobbies()
                               .then((lobbies) => {
                                   // console.log("emitting ALL LOBBIES ", lobbies);
                                   io.emit("receive lobby list", lobbies);
                               });

                           // creating the lobby player list
                           rooms_playerlist[roomID] = {};
                           rooms_playerlist[roomID][info.email] = info.name;


                           // create a socket room, in which from now on, all your communications
                           // socketwise will stay within the room
                           socket.join(roomID);

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
    // once the room is created, it will ask for the rest of the lobby information with the roomid
    socket.on('ask for lobby info', (roomID) => {
        console.log("ROOM asked for lobby info given roomID", roomID);
        let res = null;
        dbUtil.getLobby(roomID)
            .then(lobby => {
                console.log("Got lobby", lobby);
                // if the lobby somehow doesn't exist, print an error statement
                if(!lobby){
                    console.log("Error with the roomID");
                }else{
                    console.log("setting the lobby");
                    res = lobby;
                }

                // once I know that the lobby is good, I set my socket to join that room
                // and return to the lobby the lobby info
                socket.join(roomID);
                socket.emit('giving lobby info', res);
            });

    });

    /*
     In the room component, whenever someone joins, it will receive an updated players list, which it will then
     use to update its state, that will contain all the players inside.
     this is the event when i'm joining a lobby and moving to the room component
    info: code : the join code. email : user's email. username: user's name
     */
    socket.on("join certain lobby", (info) => {
        console.log("all lobbies:", rooms_playerlist);
        console.log("lobby trying to join ... ", info.code, rooms_playerlist[info.code]);

        rooms_playerlist[info.code][info.email] = info.username;
        console.log("update lobby list", rooms_playerlist[info.code]);
        io.emit("update lobby list", rooms_playerlist[info.code]);

    });

    // method for a player to leave a lobby
    socket.on("leave lobby", info => {
        // console.log(info.room, info.player);
        // console.log("Player list for lobby before deletion", rooms_playerlist[info.room]);
        // console.log(rooms_playerlist[info.room][info.player]);
        // console.log("in server, leaving the lobby ", info.room);
        delete rooms_playerlist[info.room][info.player];
        // console.log("Player list for lobby after deletion", rooms_playerlist[info.room]);

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

    // In the lobby, when finalized that the game is starting, send the map to client
    socket.on('game starting', () => {
        socket.emit('game starting ack', gameMap );
    });


    socket.on("lobby start timer", (info) => {
        let {timer, room} = info;
        let countdown = Math.floor(timer/1000);
        // send to all sockets an event every second
        let timerID = setInterval(() => {
            console.log(countdown);
            countdown--;
            io.to(room).emit("lobby current timer", countdown);
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


