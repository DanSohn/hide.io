import React, {Component} from "react";
import Header from "../assets/header";
import Break from "../assets/break";
import {socket} from "../assets/socket";

import "bootstrap/dist/js/bootstrap.bundle";
import "../assets/App.css";
import {returnGameMode, returnGameMap, returnGameTime } from  "../assets/utils";
import ViewLobbies from "./viewLobbies";
import Game from "../Game/Game";
import ClickSound from "../sounds/click"

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: this.props.name,
            email: this.props.email,
            image: this.props.image,
            roomID: this.props.join_code,
            title: "",
            game_mode: "",
            game_time: "",
            game_map: "",
            start: false,
            numPlayers: 0,
            players: {}
        };
        this.goPrevious = this.goPrevious.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.start = this.start.bind(this);
        console.log("in room, asking for lobby info given room id", this.state.roomID);
        socket.emit("ask for lobby info", this.state.roomID);

    }

    goPrevious() {
        ClickSound()
        this.setState({
            previous: true
        });
    }

    startTimer() {
        // 3 second timer currently
        ClickSound();
        socket.emit("game starting");
        socket.on("game starting ack", (gameMap) => {this.state.game_map = gameMap});
        socket.emit("lobby start timer", 3100);
    }

    start() {
        ClickSound()
        this.setState({
            start: true
        });
    }

    componentDidMount() {
        // TODO: Currently, if the server is active when the lobby was created adn you join its fine as its stored
        // in hte server. However, once it disconnects it goes haywire. Try and fix this issue by having it initialized
        // by grabbing the lobby list initially from the database
        // socket.emit("player joined");
        socket.on('giving lobby info', (lobby) => {
            if(!lobby){
                console.log("Received not a lobby! Check room.js line 54, and server.js line 119");
            }else{
                this.setState({
                    title: lobby.lobby_name,
                    game_mode: returnGameMode(lobby.game_mode),
                    game_time: returnGameTime(lobby.game_time),
                    game_map: returnGameMap(lobby.game_map)

                });
            }
        });
        // everytime this event is called, its passed a set of the users in the lobby
        // parameter: lobby_users - a SET containing all the users username
        socket.on("update lobby list", (lobby_users) => {
            console.log("Received current lobby users ", lobby_users);
        });

        /*socket.on("Number of players", num_players => {
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
        });*/

        socket.on("lobby current timer", countdown => {
            console.log(countdown);
            // after i reach 0, call startGame
            if (countdown <= 0) {
                console.log("starting game");
                this.start();
            }
        });
    }

    componentWillUnmount() {
        socket.off("giving lobby info");
        socket.off("update lobby list");
        socket.off("lobby current timer");
    }

    render() {
        console.log("rendering in ROOM");
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
                    map = {this.state.game_map}
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
                    <Break/>
                    <div className="ContentScreen">
                        <div className="chatRoom">
                            <div className="chat">
                                <ul id="messages"></ul>
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    aria-describedby="basic-addon2"
                                />

                                <div className="input-group-append">
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="roomActions">
                            <button
                                className="btn btn-success"
                                onClick={this.startTimer}>
                                Start Game
                            </button>
                            <h3>Game Mode:</h3>
                            <h6>{this.state.game_mode}</h6>
                            <h3>Time Limit:</h3>
                            <h6>{this.state.game_time}</h6>
                            <h3>Map:</h3>
                            <h6>{this.state.game_map}</h6>
                        </div>
                        <div className="online"></div>
                    </div>
                </div>
            );
        }
        return <React.Fragment>{comp}</React.Fragment>;
    }
}

export default Room;
