const io = require('socket.io-client');

export const socket = io.connect('https://hideio.herokuapp.com');
