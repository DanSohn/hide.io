import React, { Component } from "react";
import Lobby from "./Lobby";
import PlayerProfile from "../PlayerProfile.js";
import Header from "../assets/header";
import Break from "../assets/break";
import { socket } from "../assets/socket";

import "bootstrap/dist/js/bootstrap.bundle";
import "../assets/App.css";
import ViewLobbies from "./viewLobbies";
import Game from "../Game/Game";

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: this.props.name,
            email: this.props.email,
            image: this.props.image,
            title: "Room Name should be from database?",
            start: false,
            numPlayers: 0,
            players: {}
        };
        this.goPrevious = this.goPrevious.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.start = this.start.bind(this);
    }

    goPrevious() {
        this.setState({
            previous: true
        });
    }
    startTimer() {
        // 3 second timer currently
        socket.emit("lobby start timer", 3100);
    }
    start() {
        this.setState({
            start: true
        });
    }

    componentDidMount() {
        console.log("finished rendering");
        socket.emit("player joined");
        socket.on("Number of players", num_players => {
            console.log("number of players ", num_players);
            this.setState({
                numPlayers: num_players
            });
        });

        socket.on("players list", players => {
            console.log("Recieved list of players");
            console.log(players);
            this.setState({
                players: players
            });
        });

        socket.on("lobby current timer", countdown => {
            console.log(countdown);
            // after i reach 0, call startGame
            if (countdown <= 0) {
                console.log("starting game");
                this.start();
            }
        });
    }

    render() {
        let comp;
        if (this.state.previous) {
            comp = (
                <ViewLobbies
                    email={this.state.email}
                    name={this.state.userName}
                    image={this.state.image}
                />
            );
        } else if (this.state.start) {
            comp = (
                <Game
                    numPlayers={this.state.numPlayers}
                    players={this.state.players}
                />
            );
        } else {
            comp = (
                <div className="GameWindow">
                    <Header
                        previous={this.goPrevious}
                        image={this.state.image}
                        title={this.state.title}
                    />
                    <Break />
                    <div className="ContentScreen">
                        <div className="chatRoom">
                            <div class="chat">
                                <ul id="messages"></ul>
                            </div>
                            <div class="inputBox">
                                <input id="m" autocomplete="off" />
                                <button>Send</button>
                            </div>
                        </div>

                        <div className="roomActions">
                            <button
                                className="btn btn-success"
                                onClick={this.startTimer}>
                                Start Game
                            </button>
                            <h3>Game Mode:</h3>
                            <h6>love</h6>
                            <h3>Time Limit:</h3>
                            <h6>love</h6>
                            <h3>Map:</h3>
                            <h6>love</h6>
                        </div>
                        <div className="online"> </div>
                    </div>
                </div>
            );
        }
        return <React.Fragment>{comp}</React.Fragment>;
    }
}
export default Room;
