import React, {Component} from 'react';
import Game from '.\\game\\Game';


// socket stuff
//import socketIOClient from "socket.io-client";
import io from 'socket.io-client';

let socket;

class Router extends Component {
    // might need to import props at another time?
    constructor(){
        super();
        // initialize my socket
        socket = io();

    }
    render() {
        return (
            <div className="App">
                <Game/>
            </div>
        );
    }
}

export { Router, socket };
