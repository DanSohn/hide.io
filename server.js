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

// this occurs upon server start, or more importantly, server restart.
// the lobbies that exist should have NO ONE IN THEIR PLAYER LISTS
dbUtil.serverStartLobbies()
    .then(()=>{
        console.log("Lobbies have been reset")
    })
    .catch(err=>console.log(err));

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
                if (user !== null) {
                    socket.emit("user database check", user.username);
                    socket_info["name"] = user.username;
                } else {
                    socket.emit("user database check", null);
                }
            });
    });

    socket.on("create user", (info) => {
        dbUtil.createUser(info)
            .then((res) => {
                if (!res) {
                    console.log("Did not provide all information. Try again");
                } else {
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
            .then(lobbies=>{
                io.emit("receive lobby list", lobbies);
            })
            .catch(err=>console.log("addUserToLobby", err));

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
            .then(lobby => {
                if (!lobby) {
                    dbUtil.createLobby(roomID, info)
                        .then(() => {
                            // creating the lobby player list
                            /*rooms_playerlist[roomID] = [];
                            rooms_playerlist[roomID].push({email: info.email, username: info.name});
                            console.log("Added to rooms playerlist", rooms_playerlist[roomID]);
                            console.log("Current rooms_playerlist", rooms_playerlist);*/
                            dbUtil.addUserToLobby({roomID: roomID, email: info.email, username: info.name})
                                .then(() => {
                                    // create a socket room, in which from now on, all your communications
                                    // socketwise will stay within the room
                                    socket.join(roomID);

                                    // after lobby is created, I return the join code of it (createLobby.js)
                                    socket.emit("created lobby return code", roomID);

                                    // Update lobby list for those in viewLobbies
                                    dbUtil.getLobbies()
                                        .then(lobbies=>{
                                            io.emit("receive lobby list", lobbies);
                                        })
                                        .catch(err=>console.log("addUserToLobby", err));
                                }).catch(err => console.log("createLobby", err));
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
                if (!lobby) {
                    console.log("Error with the roomID");
                } else {
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
                if (lobby) {
                    lobbyFound = true;
                    // add the user to the lobby, join the socket room and emit that the lobby is found
                    // to the join_code.js
                    dbUtil.addUserToLobby({roomID: info.room, email: info.email, username: info.username})
                        .then(() => {
                            socket.join(info.room);
                            socket.emit("validate join code res", lobbyFound);
                        })
                        .catch(err => console.log(err));
                } else {
                    socket.emit("validate join code res", lobbyFound);
                }

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

        dbUtil.addUserToLobby({roomID: info.room, email: info.email, username: info.username})
            .then(() => {
                socket.join(info.room);
                socket.emit("joining certain lobby success");
                // get list of users in the lobby
                dbUtil.getLobbyPlayers(info.room)
                    .then((players) => {

                        // send to all sockets part of the room, inside room.js
                        io.to(info.room).emit("update lobby list", players);
                    })
                    .catch(err => console.log(err));

            })
            .catch(err => console.log(err));
    });

    // method for a player to leave a lobby (room.js)
    socket.on("leave lobby", info => {
        console.log("SOCKET EVENT LEAVE LOBBY");

        socket_info["lobby"] = "";
        dbUtil.removeUserFromLobby(info)
            .then(()=>{
                socket.emit("may successfully leave lobby");
                socket.leave(info.room);
            })
            .catch(err=>console.log(err));
    });

    // upon a player movement event, i will update the players array object with their new positions, and
    // emit a event to redraw the new positions
    socket.on('player movement', (info) => {

        console.log("This is what I got from player: ",info);
        console.log("This is what im sending the player: ", {x:info.x, y: info.y});

        io.to(info.roomID).emit('player moved', {x: info.x, y: info.y})
    });

    socket.on("lobby start timer", (info) => {
        console.log("SOCKET EVENT LOBBY START TIMER");
        let {timer, room} = info;
        console.log("TIMER, ROOM: ", timer, room);
        let countdown = Math.floor(timer / 1000);
        // send to all sockets an event every second
        let timerID = setInterval(() => {
            console.log(countdown);
            countdown--;
            io.to(room).emit("lobby current timer", countdown);
        }, 1000);

        // after the timer amount of seconds (default 5), stop emitting
        setTimeout(() => {
            clearInterval(timerID)
        }, timer);

    });

    socket.on("disconnect", () => {
        console.log("SOCKET EVENT DISCONNECT");
        if(socket_info.email && socket_info.lobby){
            dbUtil.removeUserFromLobby({room: socket_info.lobby, email: socket_info.email})
                .then()
                .catch(err=>console.log(err));
        }
    });

});



