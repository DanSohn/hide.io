let mongoose = require('mongoose');

// set up db connection
let db = 'mongodb+srv://dbUser:dbUserPassword@hideio-wic1l.mongodb.net/Game?retryWrites=true&w=majority';
// Connect to mongo
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
// Database models (schema)
const User = require('./models/User');
const Lobby = require('./models/Lobby');


// creates a new lobby given info
async function createLobby(roomID, info){
    console.log("--------- CREATELOBBY IN DBUTILS ----------");
    if(!roomID || !info){
        console.log("Please provide information to create a lobby");
        return;
    }

    const newLobby = new Lobby({
        join_code: roomID,
        creator_email: info.email,
        lobby_name: info.lobbyName,
        game_mode: info.gameMode,
        game_time: info.gameTime,
        game_map: info.gameMap,
        players: [],
        creation_date: Date.now()
    });

    await newLobby.save()
        .then(lobby => {
            console.log(lobby, " has successfully been added to the database");
        })
        .catch(err => console.log(err));
}

// creates a new user given info
async function createUser(info){
    console.log("--------- CREATEUSER IN DBUTILS ----------");
    if(!info.username || !info.email){
        console.log("Please provide username and email");
        return null;
    }
    // create a new user based on the schema
    const newUser = new User({
        username: info.username,
        email: info.email
    });
    // save the user to mongoDB, returning a promise when it succeeds
    await newUser.save()
        .then(user => {
            console.log(user, " has successfully been added to the database");
        })
        .catch(err => console.log(err));

    return 1;
}


// returns all users
async function getLobbies(){
    // use .lean() to not use mongoose documents, but plain old javascript objects,
    // allowing the user to change shit up (possibly bad)
    return await Lobby.find().lean();
}

// returns all lobbies
async function getUsers(){
    return await User.find();
}

// returns the specified lobby if it exists. Otherwise, return null
async function getLobby(roomID){
    // console.log("--------- GETLOBBY IN DBUTILS ----------");
    let res;
    await Lobby.findOne({join_code: roomID})
        .then(lobby => {
            if(lobby){
                res = lobby;
            }else{
                res = null;
            }
        });
    return res;
}

// returns all lobbies, and places the joincodes into an object
async function getLobbyCodes(){
    console.log("------- GETLOBBYCODES IN DBUTILS -------");
    let lobbies = await Lobby.find();
    let lobbiesObj = {};
    lobbies.forEach(obj =>{
        // console.log(obj["join_code"]);
        lobbiesObj[obj["join_code"]] = []
    });
    // console.log(lobbiesObj);
    return lobbiesObj
}

// returns the players in the certain lobby, given the join code of the lobby
async function getLobbyPlayers(roomID){
    console.log("=======GETLOBBYPLAYERS in Dbutils======");
    let players = [];
    await Lobby.findOne({join_code: roomID})
        .then(lobby => {
            if(lobby){
                players = lobby.players;
            }
        })
        .catch(err => console.log(err));

    return players;
}

// returns an object that contains all the lobbies' join codes and the players stored in them
async function getAllLobbyPlayers(){
    console.log("=======GET ALL LOBBY PLAYERS in Dbutils======");
    let rooms_playerlist = {};
    let lobbies = await Lobby.find();
    lobbies.forEach(lobby => {
        rooms_playerlist[lobby["join_code"]] = lobby.players;
    });

    return rooms_playerlist;
}

// returns the specified user if he exists. Otherwise, returns null
async function getUser(email){
    let res;
    await User.findOne({email: email})
        .then(user => {
            if(user){
                // user exists
                res = user;
            }else{
                // user does not exist
                res = null;
            }
        })
        .catch(err => console.log(err));

    return res;
}

// give the player and the room they're joining, it'll add them to the lobbies playerlist
async function addUserToLobby(info){
    console.log("dbUtils - addUserToLobby", info);
    const {roomID, email, username} = info;
    // load the document
    const doc = await Lobby.findOne({join_code: roomID});
    let players = doc.players;
    console.log("Current lobby players", players);

    // first check to see if the user is in that player list to begin with
    for(let i = 0; i < players.length; i++){
        if(players[i].email === email){
            console.log("User was already in the lobby to begin with");
            return;
        }
    }

    // update the document
    const new_player = {email: email, name: username};
    players.push(new_player);
    const update = { players: players};
    await doc.updateOne(update);

    // check to see that it updated correctly
    const updatedDoc = await Lobby.findOne({join_code: roomID});
    console.log("updated player list:", updatedDoc.players);
}

// give the player and the room they're leaving, it'll remove them to the lobbies playerlist
async function removeUserFromLobby(info){
    console.log("dbUtils - removeUserFromLobby", info);
    const {room, email} = info;

    // load the document
    const doc = await Lobby.findOne({join_code: room});
    let players = doc.players;

    let index = -1;
    //iterate through all the players until player is found
    for(let i = 0; i < players.length; i++){
        if(players[i].email === email){
            index = i;
            break;
        }
    }
    // if the user was found in the lobby's player list, remove him
    if(index !== -1){
        players.splice(index, 1);
    }else{
        console.log("User could not be found for deletion");
    }

    // update the document
    const update = {players: players};
    await doc.updateOne(update);

    // check to see that it updated correctly
    const updatedDoc = await Lobby.findOne({join_code: room});
    console.log("updated player list for lobby:", updatedDoc.players);
}

module.exports = {
    getLobbies,
    getUsers,
    getUser,
    getLobbyPlayers,
    getAllLobbyPlayers,
    getLobbyCodes,
    getLobby,
    createLobby,
    createUser,
    addUserToLobby,
    removeUserFromLobby,
};