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
        expires: '60m',
        default: Date.now()
    }
});

// 86400 is 24 hours. The entry expires in 24 hours, and will delete itself then!
const Lobby = mongoose.model('Lobby', LobbySchema);

module.exports = Lobby;