import React, { Component } from "react";
import background_img from "./assets/Background.png";
import Background from './Background';
import Player from './Player';

import OtherPlayers from "./OtherPlayers";

import './App.css';


import { socket } from "./socket";

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

    componentDidUpdate() {
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
            /*let players_arr = Object.entries(this.state.players);
            for(let i=0; i<players_arr.length; i++){
                console.log(players_arr[i][0], players_arr[i][1].x, players_arr[i][1].y);
            }*/
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
            if(players_arr[i][0] === socket.id){
                // if its MY player then i can handle movements and such. otherwise, its just a sprite on my screen
                component_insides.push(<Player key={players_arr[i][0]} keyVal={players_arr[i][0]} xPos={players_arr[i][1].x} yPos={players_arr[i][1].y} />);
            }else{
                component_insides.push(<OtherPlayers key={players_arr[i][0]} keyVal={players_arr[i][0]} xPos={players_arr[i][1].x} yPos={players_arr[i][1].y} />);
            }
        }

        for(let i=0; i<players_arr.length; i++){
            console.log(players_arr[i][0], players_arr[i][1].x, players_arr[i][1].y);

        }

        return <div>{component_insides}</div>;

    }

    render() {
        //console.log("in game rendering");
        // temporary component
        let component = this.update_player_component();
        console.log("re-rendering");
        return (
            <div onKeyDown={this.onKeyDown} tabIndex="0">
                {/* <Background
                    backgroundImage={background_img}
                    windowWidth={this.state.windowWidth}
                    windowHeight={this.state.windowHeight}
                /> */}

                {component}
            </div>
        );
    }
}

export default Game;
