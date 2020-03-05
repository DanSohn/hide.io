import React, {Component} from 'react';

import background_img from "./assets/Background.png";
import player_img from "./assets/player.png";
import Background from './Background';
import Player from './Player';
import {socket} from './socket'

class Game extends Component {
    constructor(props) {
        super(props);

        document.body.style.overflow = "hidden";

        this.state = {
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,

            playerX: 300,
            playerY: 300,
            playerSpeed: 10,
            msg: "",
            num_of_players: this.props.numPlayers
        };

        this.onKeyDown = this.onKeyDown.bind(this);

    }


    onKeyDown(e) {
        switch (e.which) {
            case 37: // Left
                this.playerMove(this.state.playerX - this.state.playerSpeed, this.state.playerY);
                break;
            case 38: // Up
                this.playerMove(this.state.playerX, this.state.playerY - this.state.playerSpeed);
                break;
            case 39: // Right
                this.playerMove(this.state.playerX + this.state.playerSpeed, this.state.playerY);
                break;
            case 40: // Down
                this.playerMove(this.state.playerX, this.state.playerY + this.state.playerSpeed);
                break;
            default:
                break;
        }
    }

    playerMove(x, y) {
        this.setState({
            playerX: x,
            playerY: y
        });
    }


    componentDidMount() {
        console.log("in game mounting");
        //console.log("socket" + socket);

        socket.on('hello', () => {
            console.log("hello from game.js");
        });

        socket.on("new player", () => {
            console.log("New player has joined. Inside Game.js");
        })

    }


    render() {
        console.log("in game rendering");
        // temporary component
        let component_insides = [];

        for (let i = 0; i < this.props.numPlayers; i++) {
            component_insides.push(<Player playerImage={player_img}/>);
        }

        let component = <div>{component_insides}</div>;

            return (
                <div onKeyDown={this.onKeyDown} tabIndex="0">
                    <Background backgroundImage={background_img}
                                windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight}/>

                    {component}
                </div>
            )
            /*
            <Car carImage={carImg} centreX={this.state.playerX}
                         centreY={this.state.playerY} width={this.playerWidth}
                         height={this.playerHeight}/>
             */
        }
    }

    export
    default
    Game;