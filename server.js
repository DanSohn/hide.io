const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3001;

const cors = require("cors");
app.use(cors());
app.get("/", (req, res) => {
    res.send("API working properly!");
});

const dbUtil = require("./dbUtils");

const starting_pos_module = require(__dirname + "/starting_positions");
let starting_pos = starting_pos_module.starting_positions;

//Maintain a list of all the games that in progress
let gamesInSession = {};

//Maintains a list of all the players that are currently online
let socket_name = {};

// this occurs upon server start, or more importantly, server restart.
// the lobbies that exist should have NO ONE IN THEIR PLAYER LISTS
dbUtil
    .serverStartLobbies()
    .then(() => {
        console.log("Lobbies have been reset");
    })
    .catch((err) => console.log(err));

io.on("connection", (socket) => {
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
        dbUtil.getUser(email).then((user) => {
            console.log("recieved from dbutils ", user);
            socket_info["email"] = email;
            socket_name[socket.id] = {email: socket_info["email"]};
            if (user !== null) {
                socket.emit("user database check", user.username);
                socket_info["name"] = user.username;
                socket_name[socket.id].name = socket_info["name"];
            } else {
                socket.emit("user database check", null);
            }
        });
    });

    socket.on("create user", (info) => {
        dbUtil.createUser(info).then((res) => {
            if (!res) {
                console.log("Did not provide all information. Try again");
            } else {
                socket_info["name"] = info.username;
                socket_name[socket.id].name = info.username;
            }
        });
    });

    // for PlayerProfile. Returns information about the email user
    socket.on("player stats req", email => {
        dbUtil
            .getUser(email)
            .then(user => {
                socket.emit("player stats res", user);
            })
            .catch(err => console.log("player stats req", err));
    });


    //Send the rooms that are available when the user clicks play to see the available lobbies
    // it will find all the lobbies in database, and once its done, it will send the collection to the socket
    // from LobbyTables
    socket.on("please give lobbies", () => {
        console.log("socket event please give lobbies");
        sendLobbies();
    });

    //When player creates a new lobby to play with their friends (createLobby.js)
    //User creates lobby with a name (no need to be unique), with settings for the game
    // PARAMETERS:
    //          info: an object containing: email, name, lobbyName, gameMode, gameTime, gameMap
    socket.on("create lobby", (info) => {
        console.log("SOCKET EVENT CREATE LOBBY", info);
        // console.log("Creating lobby with info ", info);
        let roomID = Math.random().toString(36).slice(2, 8);

        dbUtil.getLobby(roomID).then((lobby) => {
            if (!lobby) {
                dbUtil.createLobby(roomID, info).then(() => {
                    dbUtil
                        .addUserToLobby({roomID: roomID, email: info.email, username: info.name})
                        .then(() => {
                            // create a socket room, in which from now on, all your communications
                            // socketwise will stay within the room
                            socket.join(roomID);

                            // after lobby is created, I return the join code of it (createLobby.js)
                            socket.emit("created lobby return code", roomID);

                            // Update lobby list for those in viewLobbies
                            dbUtil
                                .getLobbies()
                                .then((lobbies) => {
                                    io.emit("receive lobby list", lobbies);
                                })
                                .catch((err) => console.log("addUserToLobby", err));
                        })
                        .catch((err) => console.log("createLobby", err));
                });
            }
        });
    });

    // once the room is created, it will ask for the rest of the lobby information with the roomid (room.js)
    socket.on("ask for lobby info", (roomID) => {
        console.log("SOCKET EVENT ASK FOR LOBBY INFO", roomID);
        let res = null;
        dbUtil.getLobby(roomID).then((lobby) => {
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
            socket.emit("giving lobby info", res);
        });
    });

    // in the joinCode.js component, checks if the roomID is a valid roomID to join
    socket.on("validate join code req", (info) => {
        console.log("SOCKET EVENT VALIDATE JOIN CODE REQ");

        dbUtil.getLobby(info.room).then((lobby) => {
            let lobbyFound = false;
            if (lobby) {
                lobbyFound = true;
                // add the user to the lobby, join the socket room and emit that the lobby is found
                // to the join_code.js
                dbUtil
                    .addUserToLobby({
                        roomID: info.room,
                        email: info.email,
                        username: info.username,
                    })
                    .then(() => {
                        socket.join(info.room);
                        socket.emit("validate join code res", lobbyFound);
                    })
                    .catch((err) => console.log(err));
            } else {
                socket.emit("validate join code res", lobbyFound);
            }
        });
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

        dbUtil
            .addUserToLobby({roomID: info.room, email: info.email, username: info.username})
            .then(() => {
                socket.join(info.room);
                socket.emit("joining certain lobby success");
                // get list of users in the lobby
                dbUtil
                    .getLobbyPlayers(info.room)
                    .then((players) => {
                        // send to all sockets part of the room, inside room.js
                        io.to(info.room).emit("update lobby list", players);
                        dbUtil
                            .getLobbies()
                            .then((lobbies) => {
                                io.emit("receive lobby list", lobbies);
                            })
                            .catch((err) =>
                                console.log("could not update lobby list for everyone else", err)
                            );
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    });

    socket.on("send message", (info) => {
        io.emit("message from server", {
            username: info.username,
            message: info.message,
        });
    });

    // in room.js, if there is an action, then update the lobby's createdAt to reset the TTL timer
    socket.on("reset lobby timer", (room) => {
        dbUtil
            .updateLobbyTimer(room)
            .then(() => {
                console.log("lobby ", room, " has been updated");
            });
    })

    // check for if the lobby still in the DB
    socket.on("does the lobby still exist", (room) => {
        console.log("socket event does lobby still exist, given", room);
        dbUtil.getLobby(room)
            .then((lobby)=>{
                let status = true;
                if(!lobby){
                    status = false;
                }
                // console.log("does lobby exist? ", lobby, status);
                socket.emit("lobby existence", status);
            })
    });
    // method for a player to leave a lobby (room.js)
    socket.on("leave lobby", (info) => {
        console.log("SOCKET EVENT LEAVE LOBBY");

        socket_info["lobby"] = "";
        dbUtil
            .removeUserFromLobby(info)
            .then(() => {
                socket.emit("may successfully leave lobby");
                socket.leave(info.room);
                dbUtil
                    .getLobbyPlayers(info.room)
                    .then((players) => {
                        // send to all sockets part of the room, inside room.js
                        io.to(info.room).emit("update lobby list", players);
                        dbUtil
                            .getLobbies()
                            .then((lobbies) => {
                                io.emit("receive lobby list", lobbies);
                            })
                            .catch((err) =>
                                console.log("could not update lobby list for everyone else", err)
                            );
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    });

    // upon a player movement event, i will update the players array object with their new positions, and
    // emit a event to redraw the new positions
    socket.on('player movement', (info) => {

        // console.log("This is what I got from player: ", info);
        // console.log("This is what im sending the player: ", {x: info.x, y: info.y, id: info.id});

        io.to(info.roomID).emit('player moved', {x: info.x, y: info.y, id: info.id, room: info.roomID})
    });

    //Attach the profile image for each user that connects to the server when they are playing a game
    socket.on('profile image url', (image) => {
        socket_name[socket.id].image = image;
    });

    socket.on("lobby start timer", (info) => {
        console.log("SOCKET EVENT LOBBY START TIMER");
        let {countdowntime, room} = info;

        // get all the sockets in the room, then choose one random socket to be the hider
        let roomies = Object.keys(io.sockets.adapter.rooms[room].sockets);
        console.log("everyone in room: ", roomies);
        // if there is not enough sockets(people) in the lobby, tell the lobby so
        if (roomies.length < 2) {
            socket.emit('check enough players', false);
        } else {
            io.to(room).emit('check enough players', true);
            // set the lobby to be in game status for database. Lobby no longer shows up in the lobby tables
            dbUtil.enterGame(room)
                .then(()=>sendLobbies())
                .catch(err=>console.log(err));
            // choose one random socket to be the seeker
            let randomSeeker = roomies[Math.floor(Math.random() * roomies.length)];
            io.to(`${randomSeeker}`).emit('youre the seeker');

            let startingPositonArray = [[-1,-1], [0,-1], [1, -1], [-1, 1], [ 0, 1], [1 , 1]];

            // remove the seeker from the list of roomies
            for (let i = 0; i < roomies.length; i++) {
                if (roomies[i] === randomSeeker) {
                    roomies.splice(i, 1);
                }
                let startingX = startingPositonArray[i][0];
                let startingY = startingPositonArray[i][1];
                console.log(startingX, startingY);
                io.to(`${roomies[i]}`).emit('starting position', startingX, startingY);
            }
            // set the gamesInSession object for this game
            gamesInSession[room] = {
                'roomID': room,
                'timerID': "",
                'seeker': randomSeeker,
                'hiders': roomies,
                'caught': []
            };
            console.log("RANDOM SEEKER IS: " + gamesInSession[room].seeker);
            console.log("NUMBER OF HIDERS " + gamesInSession[room].hiders.length);

            let countdown = Math.floor(countdowntime / 1000);
            io.to(room).emit("lobby current timer", countdown);
            // send to all sockets an event every second
            let timerID = setInterval(() => {
                console.log(countdown);
                countdown--;
                io.to(room).emit("lobby current timer", countdown);
            }, 1000);

            // after the timer amount of seconds (default 3), stop emitting
            setTimeout(() => {
                clearInterval(timerID);
            }, countdowntime);
        }
    });

    socket.on("start game timer", (room, game_time) => {
        console.log("game started " + game_time);
        let mins = game_time.split(" ")[0];
        let time = {minutes: mins, seconds: 15};
        console.log(time, room);
        let timerID = setInterval(() => {
            // during the hider's running time when seeker can't move, send countdown event to the game
            if (mins === time.minutes && time.seconds === 0) {
                io.to(room).emit("countdown ended");
            }
            // normal decrement of seconds, unless seconds is at 0
            if (time.seconds > 0) {
                time.seconds--;
            } else if (time.seconds === 0) {
                // if more than 1 mins left, decrement minute by 1 and restart seconds at 59
                if (time.minutes > 0) {
                    time.seconds = 59;
                    time.minutes = time.minutes - 1;
                }
            }
            io.to(room).emit("alive player list", getAliveList(room));
            io.to(room).emit("game in progress", time);
        }, 1000);
        gamesInSession[room].timerID = timerID;

        // stop the intervals once the full time is over
        // mins * 60 0000 (60 seconds x 1 sec per milli) + 15 seconds of count down time
        gamesInSession[room].fullTime = setTimeout(() => {
            io.to(room).emit("game in progress", {minutes: 0, seconds: 0});
            endGame(room, timerID);
            console.log("Time's up");
        }, mins * 60000 + 15000);

    });

    //When a hider is caught, they emit an event to the server to update the list of players who are still hiding and
    //haven't been caught by the seeker. Incase all the players are caught, endGame() is called before time expires.
    socket.on("player caught", (info) => {

        let {playerID, room} = info;
        // console.log("COLLISION WITH:", playerID, "room: ", room);

        // console.log(">>>>>>>>>>>>>>>>> " + gamesInSession[room].hiders[0] + "    " + playerID);
        if (gamesInSession.hasOwnProperty(room) && gamesInSession[room].hasOwnProperty("hiders")) {
            if(gamesInSession[room].hiders.includes(playerID)) {
                for (let i = 0; i < gamesInSession[room].hiders.length; i++) {
                    if (gamesInSession[room].hiders[i] === playerID) {
                        gamesInSession[room].hiders.splice(i, 1);
                        console.log("after catching, hiders is now", gamesInSession[room].hiders);
                        gamesInSession[room].caught.push(playerID);

                        let playerName = socket_name[playerID].name;
                        socket.to(room).emit("I died", playerID, playerName);
                        io.to(room).emit("alive player list", getAliveList(room));
                        io.to(room).emit("display player caught", playerName);
                        break;
                    }
                }

                if (gamesInSession[room].hiders.length === 0) {
                    endGame(room, gamesInSession[room].timerID);
                }
            }
        }
    });

    // when a user disconnects from the tab, either by closing or refreshing, we remove them from any lobbies they
    // might've been a part of
    socket.on("disconnect", () => {
        console.log("SOCKET EVENT DISCONNECT");
        if (socket_info.email && socket_info.lobby) {
            dbUtil
                .removeUserFromLobby({room: socket_info.lobby, email: socket_info.email})
                .then()
                .catch((err) => console.log(err));
            delete socket_name[socket.id];
        }
    });

    // funtion to send all the current lobbies. Placed into its own function since several socket events need to use
    async function sendLobbies(){
        await dbUtil
            .getLobbies()
            .then((lobbies) => {
                io.emit("receive lobby list", lobbies);
            })
            .catch((err) => console.log("addUserToLobby", err));
    }

    //When the game finishes, statistics about the players is updated and the room is deleted from gamesInSession
    //also emit a message to the different players about who won between hiders and seeker
    function endGame(room, timerID) {
        console.log("End Game has been called");
        //TODO get information about the players that were in that game and update their stats
        clearInterval(timerID);
        clearInterval(gamesInSession[room].fullTime);
        // console.log(room + " <<<<<<<< ROOM ID" );
        if (gamesInSession.hasOwnProperty(room)) {
            // hiders are in gameses. hiders and .caught combined
            // hidersList is an array filled with alive hiders and caught hiders
            let hidersList = gamesInSession[room].hiders.concat(gamesInSession[room].caught);
            let hidersEmails = hidersList.map((socketID) => {
                return socket_name[socketID].email;
            });

            // the seekers players is an array consisting of the seeker's socketID translated to email
            let seekers = {group: "seeker", players: [socket_name[gamesInSession[room].seeker].email]}
            let hiders = {group: "hiders", players: hidersEmails}
            let winner, loser;
            if (gamesInSession[room].hiders.length === 0) {
                console.log("<<<<<<<<<<<<<<SEEKER WINS>>>>>>>>>>>.");
                winner = seekers;
                loser = hiders;
            } else if (gamesInSession[room].hiders.length > 0) {
                console.log("<<<<<<<<<<<<<<HIDER WINS>>>>>>>>>>>.");
                winner = hiders;
                loser = seekers;

            }

            io.to(room).emit("game winner", winner.group);

            dbUtil
                .updateWinners(winner.players)
                .then(() => console.log("Winners have been updated"))
                .catch(err => console.log(err));

            dbUtil
                .updateLosers(loser.players)
                .then(() => console.log("Losers have been updated"))
                .catch(err => console.log(err));

            // after 5 seconds, leave to lobby
            setTimeout(() => {
                // gamesInSession[room] = {};
                // console.log("ROOM WAS RESET", gamesInSession[room]);
                delete gamesInSession[room];
                io.to(room).emit("game finished");
                // update the lobbies list once again
                // TODO: send to event "receive lobby list" all lobbies again, and change this room to be in game false
                dbUtil
                    .leaveGame(room)
                    .then(()=>{
                        sendLobbies()
                            .then(()=>{
                                console.log("I set room back to in game false, and sent out the lobby list");
                            })
                            .catch(err => console.log(err));
                    })
            }, 5000);
        }
    }

    //Returns a list of URLs for icons for all the players that are still alive in a game (they are still hiding)
    function getAliveList(room) {
        let alivelist = [];
        for(let i = 0; i < gamesInSession[room].hiders.length; i++){
            let playerID = gamesInSession[room].hiders[i];
            alivelist.push(socket_name[playerID].image);
        }
        return alivelist;
    }
});

server.listen(PORT, function () {
    console.log("Server listening on *: " + PORT);
});