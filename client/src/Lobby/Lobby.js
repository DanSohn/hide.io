import React, {Component} from 'react';

import {socket} from '../socket'
import Game from "../Game";

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameStarted: false,
            numPlayers: 0
        };

        this.startGame = this.startGame.bind(this);
    }

    startGame(){
        this.setState({
           gameStarted: true
        });
    }

    /*findPlayers(){
        socket.emit("Number of players");
    }*/
    componentDidMount() {
        socket.on("Number of players", (num_players) => {
            console.log("number of players ", num_players);
            this.setState({
                numPlayers: num_players
            });
        });
    }

    render() {
        let comp;
        if (this.state.gameStarted === false) {
            comp = <button onClick={this.startGame}>Click here to start game </button>
        } else {
            // let numPlayers = this.findPlayers;
            comp = <Game numPlayers={this.state.numPlayers}/>
        }

        return (
            <div>
                {comp}
            </div>
        )
    }

}

export default Lobby;