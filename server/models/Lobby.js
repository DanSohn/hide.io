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
    creation_date: {
        type: Date,
        default: Date.now()
    }
});

const Lobby = mongoose.model('Lobby', LobbySchema);

module.exports = Lobby;