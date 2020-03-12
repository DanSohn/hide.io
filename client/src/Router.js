import React, {Component} from 'react';
import Lobby from "./Lobby/Lobby";
//import {socket} from './socket';

class Router extends Component {
    // might need to import props at another time?
    constructor(props){
        //console.log("Router constructor");
        super(props);
        this.state = {
            apiResponse: ""
        };
        // initialize my socket
        //socket = io();

    }


/*

EXAMPLE OF FETCHING API CALL FROM THE SERVER
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


 */
    render() {
        //console.log("Router render");
        // here, or whenever I actually enter the game, I would pass in the number of players
        return (
            <div className="App">
                <Lobby />
                <p className="App-intro">{this.state.apiResponse}</p>
            </div>
        );
    }
}

export { Router };
