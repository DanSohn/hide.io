import React, {Component} from 'react';
import {socket} from '../assets/socket';

class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            playerRole: "",
            winner: ""
        }
    }

    render(){
        let comp;
        if (this.state.playerRole === "seeker" && this.state.winner === "seeker") {
            comp = 
            <div>
                <p>Congrats {this.state.userName}...you've caught them all!</p>
                <p>returning to lobby now...</p>
            </div>
        }
        else if (this.state.playerRole === "seeker") {
            comp =
            <div>
                <p>Hey {this.state.userName}...you are a let down!</p>
                <p>returning to lobby now...</p>
            </div>
        }
        else if (this.state.winner === "hider") {
            comp = 
            <div>
                <p>Okay I guess you're slick...hiders win!</p>
                <p>returning to lobby now...</p>
            </div>
        }
        else {
            comp =
            <div>
                <p>All hiders have been caught...buncha losers ¯\_(ツ)_/¯</p>
                <p>returning to lobby now...</p>
            </div>
        }
        return {comp}
    }
}