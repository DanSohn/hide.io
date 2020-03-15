import React, {Component} from 'react';

import {socket} from '../socket'
import Game from "../Game";


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
        // 3 second timer currently
        socket.emit("lobby start timer", 3001);
    }
    startGame(){
        this.setState({
           gameStarted: true
        });
    }



    componentDidMount() {
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
            comp = <Game numPlayers={this.state.numPlayers} players={this.state.players}/>
        }

        return (
            <div>
                {comp}
            </div>
        )
    }

}

export default Lobby;