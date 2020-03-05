const io = require('socket.io-client');

export const socket = io.connect('http://localhost:3001');


/*
export default function () {
*/
/*

    function registerHandler(onMessageReceived) {
        socket.on('hello', () => {
            console.log("HELLOOOOOOOOO");
        })
    }

    function unregisterHandler() {
        socket.off('message')
    }

    socket.on('hello', () => {
        console.log("hello from socket.js");
    });

    socket.on('error', function (err) {
        console.log('received socket error:');
        console.log(err);
    });

    function register(name, cb) {
        socket.emit('register', name, cb)
    }

    function join(chatroomName, cb) {
        socket.emit('join', chatroomName, cb)
    }

    function leave(chatroomName, cb) {
        socket.emit('leave', chatroomName, cb)
    }

    function message(chatroomName, msg, cb) {
        socket.emit('message', { chatroomName, message: msg }, cb)
    }

    function getChatrooms(cb) {
        socket.emit('chatrooms', null, cb)
    }

    function getAvailableUsers(cb) {
        socket.emit('availableUsers', null, cb)
    }

    return {
        register,
        join,
        leave,
        message,
        getChatrooms,
        getAvailableUsers,
        registerHandler,
        unregisterHandler
    }
}
*/