/**
 *
 *
 *  DEPRECATED. replaced by the regular play interface.
 *  Kept for testing purposes
 *
 *
 */



import React, {Component} from 'react';

import {socket} from '../assets/socket'
import Game from "../Game/Game";
import ClickSound from "../sounds/click"

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameStarted: false,
            numPlayers: 0,
            players: {}
        };

        this.startGame = this.startGame.bind(this);
        this.startTimer = this.startTimer.bind(this);
    }

    startTimer(){
        // 3 second timer, let the server know the game wants to start and you want the map
        ClickSound()
        socket.emit("lobby start timer", 3100);
        socket.emit('game starting');
        socket.on('game starting ack', (gameMap) => {this.state.gameMap = gameMap});
    };
    startGame(){
        ClickSound()
        this.setState({
           gameStarted: true
        });
    }



    componentDidMount() {
        console.log("finished rendering");
        socket.emit("player joined");
        socket.on("Number of players", (num_players) => {
            console.log("number of players ", num_players);
            this.setState({
                numPlayers: num_players
            });
        });

        socket.on("players list", (players) => {
            console.log("Recieved list of players");
            console.log(players);
            this.setState({
               players: players
            });
        });

        socket.on("lobby current timer", (countdown) =>{
            console.log(countdown);
            // after i reach 0, call startGame
            if(countdown <= 0){
                console.log("starting game");
                this.startGame();
            }
        });
    }

    render() {
        let comp;
        if (this.state.gameStarted === false) {
            comp = <button onClick={this.startTimer}>Click here to start game </button>
        } else {
            // let numPlayers = this.findPlayers;
            console.log("my players: ", this.state.players);
            comp = <Game numPlayers={this.state.numPlayers} players={this.state.players} map={this.state.gameMap}/>;
        }

        return (
            <div>
                {comp}
            </div>
        )
    }

}

export default Lobby;