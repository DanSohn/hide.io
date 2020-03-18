const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    joindate: {
        type: Date,
        default: Date.now()
    },
    totalWins: {
        type: Number,
        default: 0
    },
    totalGamesPlayed: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;