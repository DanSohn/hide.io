import io from 'socket.io-client';

// export const socket = io.connect('https://hideio.herokuapp.com');
// export const socket = io.connect(process.env.PORT||'localhost:3001', {
//     reconnectionDelay: 1000,
//     reconnectionDelayMax: 5000,
// });

export const socket = io();