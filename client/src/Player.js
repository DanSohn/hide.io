import React, {Component} from 'react';
import player_img from "./assets/player.png";

import {socket} from './socket'

class Player extends Component {

    constructor(props) {
        super(props);

        this.state = {
            playerX: this.props.xPos,
            playerY: this.props.yPos,
            playerSpeed: 50,

        };
        this.onKeyDown = this.onKeyDown.bind(this);

    }

    componentDidMount() {
        window.onkeydown = this.onKeyDown;
    }


    onKeyDown(e) {
        switch (e.which) {
            case 37: // Left
                console.log("left");

                this.playerMove(this.state.playerX - this.state.playerSpeed, this.state.playerY);
                break;
            case 38: // Up
                console.log("up");

                this.playerMove(this.state.playerX, this.state.playerY - this.state.playerSpeed);
                break;
            case 39: // Right
                console.log("right");

                this.playerMove(this.state.playerX + this.state.playerSpeed, this.state.playerY);
                break;
            case 40: // Down
                console.log("down");
                this.playerMove(this.state.playerX, this.state.playerY + this.state.playerSpeed);
                break;
            default:
                break;
        }
    }

    playerMove(x, y) {
        console.log("Sending player movement event to server");
        socket.emit("Player movement", [x,y]);
    }

    render() {
        console.log("Rendering client : ", this.props.keyVal, this.state.playerX, this.state.playerY);
        const player_attr = {
            width: 50,
            height: 50,
            top: this.state.playerY,
            left: this.state.playerX,
            position: 'absolute'
        };

        return (
            <img src={player_img}
                 style={player_attr}
                 alt="Player sprite for the game"
            />
        );
    }
}

export default Player;