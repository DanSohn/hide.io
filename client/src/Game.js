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
            players: this.props.players,
            game_status: "not started"
        };

        this.update_player_component = this.update_player_component.bind(this);

    }



    componentDidMount() {
        //console.log("in game mounting");
        //console.log("socket" + socket);
        this.setState({game_status: "in progress"});
        // this will only happen the first time, and will set the ball rolling to handle any updates!
        /*socket.on("Redraw positions", (players) =>{
            console.log("Redrawing positions in client");
            this.setState({players: players});
        });*/
        socket.on("Redraw positions", (players) => {
            console.log("client updating players");
            // if there has been a change to players' positions, then reset the state of players to new coordinates
            if(this.state.players !== players){
                console.log("movement indeed");
                this.setState({players: players});
            }
            let players_arr = Object.entries(this.state.players);
            for(let i=0; i<players_arr.length; i++){
                console.log(players_arr[i][0], players_arr[i][1].x, players_arr[i][1].y);
            }
        });

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /*console.log("component did update");
        socket.on("Redraw positions", (players) => {
            console.log("client updating players");
            // if there has been a change to players' positions, then reset the state of players to new coordinates
            if(prevState.players !== players){
                console.log("movement indeed");
                this.setState({players: players});
            }
        })
        let players_arr = Object.entries(this.state.players);
        for(let i=0; i<players_arr.length; i++){
            console.log(players_arr[i][0], players_arr[i][1].x, players_arr[i][1].y);
        }*/
    }

    // this function creates multiple player components
    update_player_component(){
        // console.log("creating players");
        console.log("UPDATING PLAYER COMPONENTS");

        let players_arr = Object.entries(this.state.players);
        // console.log(players_arr);
        // console.log(typeof players_arr);

        let component_insides = [];

        /*players_arr.forEach((element) =>{
            console.log("iterating ...", key);
            component_insides.push(<Player key={players_arr} xPos={   this.state.players.key.x} yPos={this.state.players.key.y}/>);
            //component_insides.push(<Player key={key} xPos={   this.state.players.key.x} yPos={this.state.players.key.y}/>);

            console.log("thank you");

        });*/

        for(let i=0; i<players_arr.length; i++){
            // console.log("iterating through list");
            component_insides.push(<Player key={players_arr[i][0]} xPos={players_arr[i][1].x} yPos={players_arr[i][1].y} />);
        }

        // console.log(component_insides[0]);
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
        let component = this.update_player_component();

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