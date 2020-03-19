const io = require('socket.io-client');

export const socket = io.connect('http://localhost:3001');
