let mongoose = require('mongoose');

// set up db connection
let db = 'mongodb+srv://dbUser:dbUserPassword@hideio-wic1l.mongodb.net/Game?retryWrites=true&w=majority';
// Connect to mongo
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
// Database models (schema)
const User = require('./models/User');
const Lobby = require('./models/Lobby');

// returns all users
async function getLobbies(){
    return await Lobby.find();
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


module.exports = {
    getLobbies,
    getUsers,
    getUser,
    getLobby,
    createLobby,
    createUser
};