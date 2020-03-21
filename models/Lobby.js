const mongoose = require('mongoose');

const LobbySchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        expires: '60m',
        default: Date.now()
    }
});

// 86400 is 24 hours. The entry expires in 24 hours, and will delete itself then!
const Lobby = mongoose.model('Lobby', LobbySchema);

module.exports = Lobby;