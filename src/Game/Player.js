import React, {Component} from 'react';
import player_img from "../assets/images/player.png";

import {socket} from '../assets/socket'

class Player extends Component {

    constructor(props) {
        console.log("Player constructor");
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("Player is updating location");
        if(this.props.xPos !== prevProps.xPos || this.props.yPos !== prevProps.yPos){
            this.setState({
                playerX: this.props.xPos,
                playerY: this.props.yPos
            })
        }
    }

    // onKeyDown(e) {
    //     switch (e.which) {
    //         case 37: // Left
    //             this.playerMove(this.state.playerX - this.state.playerSpeed, this.state.playerY);
    //             break;
    //         case 38: // Up
    //             this.playerMove(this.state.playerX, this.state.playerY - this.state.playerSpeed);
    //             break;
    //         case 39: // Right
    //             this.playerMove(this.state.playerX + this.state.playerSpeed, this.state.playerY);
    //             break;
    //         case 40: // Down
    //             this.playerMove(this.state.playerX, this.state.playerY + this.state.playerSpeed);
    //             break;
    //         default:
    //             break;
    //     }
    // }

    playerMove(x, y) {
        console.log("Sending player movement event to server");
        // socket.emit("Player movement", [x,y]);
    }

    render() {
        // console.log("Rendering client : ", this.props.keyVal, this.state.playerX, this.state.playerY);
        console.log("Player render");
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