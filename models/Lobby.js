const mongoose = require('mongoose');

const LobbySchema = new mongoose.Schema({
    expireAt: {
        type: Date,
        default: Date.now
    },
    join_code: {
        type: String,
        required: true
    },
    creator_email: {
        type: String,
        required: true
    },
    lobby_name: {
        type: String,
        required: true
    },
    game_mode: {
        type: String,
        required: true
    },
    game_time: {
        type: String,
        required: true
    },
    game_map: {
        type: String,
        required: true
    },
    players: {
        type: Array,
        required: true
    },
    in_game: {
        type: Boolean,
        default: false,
        required: true
    }

});

LobbySchema.index({"expireAt": 1}, {expireAfterSeconds: 60})
// 86400 is 24 hours. The entry expires in 24 hours, and will delete itself then!
const Lobby = mongoose.model('Lobby', LobbySchema);

module.exports = Lobby;