import React, {Component} from 'react';

import {socket} from '../socket'
import Game from "../Game";

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameStarted: false
        }

        this.startGame = this.startGame.bind(this);
    }

    startGame(){
        this.setState({
           gameStarted: true
        });
    }

    render() {
        let comp;
        if (this.state.gameStarted === false) {
            comp = <button onClick={this.startGame}>Click here to start game </button>
        } else {
            comp = <Game/>
        }

        return (
            <div>
                {comp}
            </div>
        )
    }

}

export default Lobby;