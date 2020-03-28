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
        });

    return res;
}

module.exports = {
    getLobbies,
    getUsers,
    getUser
};