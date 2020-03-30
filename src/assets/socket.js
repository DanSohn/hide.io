const io = require('socket.io-client');

export const socket = io.connect('https://hideio.herokuapp.com:'+process.env.PORT);
// export const socket = io(process.env.PORT||'localhost:3001')
