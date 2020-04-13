import io from 'socket.io-client';

// export const socket = io.connect('https://hideio.herokuapp.com');
export const socket = io(process.env.PORT||'localhost:3001')
