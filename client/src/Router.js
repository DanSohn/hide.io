import React, {Component} from 'react';
import Game from './Game';
import socket from './socket';


// socket stuff
//import socketIOClient from "socket.io-client";

class Router extends Component {
    // might need to import props at another time?
    constructor(props){
        console.log("Router constructor");
        super(props);
        this.state = { apiResponse: "",
                        client: socket()
        };
        // initialize my socket
        //socket = io();

    }

    callAPI() {
        console.log("Router callAPI");

        fetch("http://localhost:3001/")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }));
    }

    componentWillMount() {
        console.log("Router componentWillMount");

        this.callAPI();
    }

    render() {
        console.log("Router render");

        return (
            <div className="App">
                <Game/>
                <p className="App-intro">;{this.state.apiResponse}</p>
            </div>
        );
    }
}

export { Router, socket };
