import React, {Component} from 'react';

import background_img from "./assets/Background.png";
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
            msg: "",
            num_of_players: this.props.numPlayers,
            players: this.props.players
        };

        this.create_player_component = this.create_player_component.bind(this);

    }



    componentDidMount() {
        //console.log("in game mounting");
        //console.log("socket" + socket);

        socket.on('hello', () => {
            console.log("hello from game.js");
        });
        socket.on("Redraw positions", (players) =>{
            console.log("Redrawing positions with: ");
            console.log(players);
        });

    }

    // this function creates multiple player components
    create_player_component(){
        console.log("creating players");
        let component_insides = [];
        console.log(this.state.players);

        Object.keys(this.state.players).forEach((key, index) =>{
            console.log(this.state.players);
            component_insides.push(<Player key={this.state.players.key} xPos={this.state.players.key.x} yPos={this.state.players.key.y}/>);

        });

        return <div>{component_insides}</div>;

    }
    /*create_player_component() {
        // this function will take in the index of the player and return a x y coordinate
        function get_starting_position(i) {
            return starting_pos[i];
        }
        // initialize the array of players
        let component_insides = [];

        // iterate through number of players and add a player react component to the array, passing in the player_img
        for (let i = 0; i < this.props.numPlayers; i++) {
            // get the starting position of the player
            let position = get_starting_position(i);
            component_insides.push(<Player key={i} xPos={position.x} yPos={position.y}/>);
        }
        // this is for react-key-index.
        // https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js
        // not working, so switched to key being index. THIS MAY CAUSE PROBLEMS DOWN THE LINE POTENTIALLY
        //component_insides = keyIndex(component_insides, 1);

        return <div>{component_insides}</div>;
    }*/

    render() {
        //console.log("in game rendering");
        // temporary component
        let component = this.create_player_component();

        return (
            <div onKeyDown={this.onKeyDown} tabIndex="0">
                <Background backgroundImage={background_img}
                            windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight}/>

                {component}
            </div>
        )
    }
}

export default Game;