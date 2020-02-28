import React, {Component} from 'react';
import Game from './Game';
import socket from './socket';


// socket stuff
//import socketIOClient from "socket.io-client";

class Router extends Component {
    // might need to import props at another time?
    constructor(props){
        super(props);
        this.state = { apiResponse: ""};
        // initialize my socket
        //socket = io();

    }

    callAPI() {
        fetch("http://localhost:3001/")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }));
    }

    componentWillMount() {
        this.callAPI();
    }

    render() {
        return (
            <div className="App">
                <Game/>
                <p className="App-intro">;{this.state.apiResponse}</p>
            </div>
        );
    }
}

export { Router, socket };
