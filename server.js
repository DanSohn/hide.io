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

// create players object
let players = {};
// console.log("Initial players list: ", players);

/* the structure of rooms_playerlist is :
rooms_playerlist = {
a1a1a1a: players = [{email: str, username: str}, {email: str, username: str} ... ]
b1b1b1b1: players = as above
c1...
d1d1....
}
 */
let rooms_playerlist = roomPlayerList();
// create a rooms object to keep track of rooms and the players inside each room
// key equals room_id (join code)
async function roomPlayerList(){
    await dbUtil.getLobbyCodes()
        .then(lobbies => {
            rooms_playerlist = lobbies;
            console.log("rooms player list", rooms_playerlist);
        })
        .catch(err => console.log(err));
}


io.on('connection', (socket) => {
    // console.log("A User has connected");

    /*
    Socket info will maintain for each socket all their individual information for ease of access for the needs of
    individual client. I keep track of email, username, and latest lobby they're in
     */
    let socket_info = {};
    // when a player is logging in through oauth, i cross-check the given info with the database to see
    // if the user already exists (email). If he does, I emit a message to go straight to main menu, otherwise to
    // go to user selection first
    socket.on("user exists check", (email) => {
        dbUtil.getUser(email)
            .then((user) => {
                console.log("recieved from dbutils ", user);
                socket_info["email"] = email;
                if(user !== null){
                    socket.emit("user database check", user.username);
                    socket_info["name"] = user.username;
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
                }else{
                    socket_info["name"] = info.username;
                }
            });
    });

    //Send the rooms that are available when the user clicks play to see the available lobbies
    // it will find all the lobbies in database, and once its done, it will send the collection to the socket
    // from lobbyTables.js
    socket.on("please give lobbies", () => {
        console.log("socket event please give lobbies");

        dbUtil.getLobbies()
            .then((lobbies) => {
                console.log("Got lobbies ", lobbies);
                console.log("Current rooms playerlist", rooms_playerlist);
                // iterate through every object lobby, and add/update the property of number of players

                for(let i = 0, len = lobbies.length; i < len; i ++){
                    console.log("Current rooms playerlist", rooms_playerlist);
                    console.log("looking for the unhandledpromise warning");
                    console.log("looking at lobby", lobbies[i]);
                    console.log("looking at playerlist", rooms_playerlist[lobbies[i].join_code]);
                    lobbies[i].num_players = rooms_playerlist[lobbies[i]["join_code"]].length;

                }

                // console.log("New lobbies:", lobbies);
                io.emit("receive lobby list", lobbies);

            });
    });

    //When player creates a new lobby to play with their friends (createLobby.js)
    //User creates lobby with a name (no need to be unique), with settings for the game
    // PARAMETERS:
    //          info: an object containing: email, name, lobbyName, gameMode, gameTime, gameMap
    socket.on("create lobby", (info) => {
        console.log("SOCKET EVENT CREATE LOBBY", info);
        // console.log("Creating lobby with info ", info);
        let roomID = Math.random().toString(36).slice(2, 8);

        dbUtil.getLobby(roomID)
            .then(lobby =>{
               if(!lobby){
                   dbUtil.createLobby(roomID, info)
                       .then(()=>{
                           // after lobby is created, I return the join code of it (createLobby.js)
                           socket.emit("created lobby return code", roomID);

                           // creating the lobby player list
                           rooms_playerlist[roomID] = [];
                           rooms_playerlist[roomID].push({email: info.email, username: info.name});
                           console.log("Added to rooms playerlist", rooms_playerlist[roomID]);


                           // create a socket room, in which from now on, all your communications
                           // socketwise will stay within the room
                           socket.join(roomID);


                           // Update lobby list for those in viewLobbies
                           dbUtil.getLobbies()
                               .then((lobbies) => {
                                   // console.log("emitting ALL LOBBIES ", lobbies);
                                   io.emit("receive lobby list", lobbies);
                               });


                       })
               }
            });
    });

    // once the room is created, it will ask for the rest of the lobby information with the roomid (room.js)
    socket.on('ask for lobby info', (roomID) => {
        console.log("SOCKET EVENT ASK FOR LOBBY INFO", roomID);
        let res = null;
        dbUtil.getLobby(roomID)
            .then(lobby => {
                // console.log("Got lobby", lobby);
                // if the lobby somehow doesn't exist, print an error statement
                if(!lobby){
                    console.log("Error with the roomID");
                }else{
                    console.log("setting the lobby successfully");
                    res = lobby;
                }

                socket_info["lobby"] = roomID;
                // once I know that the lobby is good, I set my socket to join that room
                // and return to the lobby the lobby info
                socket.join(roomID);
                socket.emit('giving lobby info', res);
            });

    });

    // in the joinCode.js component, checks if the roomID is a valid roomID to join
    socket.on("validate join code req", (info) => {
        console.log("SOCKET EVENT VALIDATE JOIN CODE REQ");

        dbUtil.getLobby(info.room)
            .then(lobby => {
                let lobbyFound = false;
                if(lobby){
                    lobbyFound = true;

                    socket.join(info.room);
                    rooms_playerlist[info.room].push({email: info.email, username: info.username});
                    console.log("Current rooms playerlist", rooms_playerlist);
                }

                socket.emit("validate join code res", lobbyFound);
            })
    });

    /*
    viewLobbies.js
     In the room component, whenever someone joins, it will receive an updated players list, which it will then
     use to update its state, that will contain all the players inside.
     this is the event when i'm joining a lobby and moving to the room component
    info: code : the join code. email : user's email. username: user's name
     */
    socket.on("join certain lobby", (info) => {
        console.log("SOCKET EVENT JOIN CERTAIN LOBBY");

        // console.log("all lobbies:", rooms_playerlist);
        console.log("lobby trying to join ... ", info.code, rooms_playerlist[info.code]);

        rooms_playerlist[info.code].push({email: info.email, username: info.username});
        console.log("Current rooms playerlist", rooms_playerlist);
        // update the lobby list in lobbyTables
        io.emit("update lobby list", rooms_playerlist[info.code]);

    });

    // method for a player to leave a lobby (room.js)
    socket.on("leave lobby", info => {
        console.log("SOCKET EVENT LEAVE LOBBY");

        socket_info["lobby"] = "";
        deletePlayerFromRoom(info);
        socket.leave(info.room);
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

    // upon a player movement event, i will update the players array object with their new positions, and
    // emit a event to redraw the new positions
    socket.on("player movement", (info) => {

        // console.log("received player movement across socket: ",info);
        io.to(info.room).emit('player moved', {X: info.X, Y: info.Y})
    });

    // In the lobby, when finalized that the game is starting, send the map to client
    socket.on('game starting', () => {
        socket.emit('game starting ack');
    });


    socket.on("lobby start timer", (info) => {
        console.log("SOCKET EVENT LOBBY START TIMER");
        let {timer, room} = info;
        console.log("TIMER, ROOM: ", timer, room);
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
        console.log("SOCKET EVENT DISCONNECT");
        socket_info.email && socket_info.lobby ? deletePlayerFromRoom({room: socket_info.lobby, email: socket_info.email}) : true;
        console.log("Updated rooms player list", rooms_playerlist);
        // i do a check if he's in a game or in a room
        // if he's in a room, then he's part of a room_playerlist where he must be removed
    });

});

// function that given info room, email and username, will find the place of the user
// in rooms_playerlist[room] and delete him
function deletePlayerFromRoom(info){
    console.log("Player list for lobby before deletion", rooms_playerlist[info.room]);

    let index = -1;
    // iterate through all the players

    for(let i = 0; i < rooms_playerlist[info.room].length; i++){
        if(rooms_playerlist[info.room][i].email === info.email){
            index = i;
            break;
        }
    }

    if(index !== -1){
        rooms_playerlist[info.room].splice(index, 1);
    }else{
        console.log("Could not find user to delete");
    }

    console.log("Player list for lobby after deletion", rooms_playerlist[info.room]);
}

