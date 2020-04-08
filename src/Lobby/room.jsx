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
import Timer from "../Game/Timer";
import TimerSound from "../sounds/timer"

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
            map: {},
            start: false,
            players: {},
            time: 3
        };
        this.goPrevious = this.goPrevious.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.start = this.start.bind(this);
        this.decreaseTimer = this.decreaseTimer.bind(this);

        // this lets the socket join the specific room
        socket.emit("ask for lobby info", this.state.roomID);
    }

    goPrevious() {
        socket.emit("leave lobby", {room: this.state.roomID, email: this.state.email});
        ClickSound();
        this.setState({
            previous: true
        });
    }

    startTimer() {
        // if (this.state.numPlayers <= 1) {
        //     alert("Go make some friends first ya loner...")
        //     return
        // }

        // 3 second timer currently
        TimerSound();
        socket.emit("game starting");
    }

    start() {
        this.setState({
            start: true
        });
    }

    decreaseTimer() {
        this.setState({
            time: this.state.time - 1
        })
    }

    componentDidMount() {
        // socket.emit("player joined");
        socket.on('giving lobby info', (lobby) => {
            if(!lobby){
                console.log("Received not a lobby! Check room.js line 54, and server.js line 119");
            }else{
                this.setState({
                    title: lobby.lobby_name,
                    game_mode: returnGameMode(lobby.game_mode),
                    game_time: returnGameTime(lobby.game_time),
                    game_map: returnGameMap(lobby.game_map),
                });
            }
        });
        // everytime this event is called, its passed a set of the users in the lobby
        // parameter: lobby_users - a SET containing all the users username
        socket.on("update lobby list", (lobby_users) => {
            console.log("Received current lobby users ", lobby_users);
        });

        // this event occurs on function startTimer()
        socket.on("game starting ack", () => {
            socket.emit("lobby start timer", {timer: 3100, room: this.state.roomID});
        });
        
        socket.on("lobby current timer", (countdown) => {
            // this.decreaseTimer()
            console.log(countdown);
            TimerSound();
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
        socket.off("game starting ack");
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
                <div>
                    <Timer />
                    <Game
                        gameID={this.state.roomID}
                        players={this.state.players}
                        map = {this.state.game_map}
                        timeLimit = {this.state.game_time}
                        mode = {this.state.game_mode}
                    />
                </div>
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
                            <h5>Join Code: {this.state.roomID}</h5>
                            <h3>Game Starting in {this.state.time}</h3>
                            <button
                                className="btn btn-success"
                                onClick={this.startTimer}>
                                Start Game
                            </button>
                            <div className="roomSettings">
                                <h4>Game Mode:</h4>
                                <h6>{this.state.game_mode}</h6>
                                <h4>Time Limit:</h4>
                                <h6>{this.state.game_time}</h6>
                                <h4>Map:</h4>
                                <h6>{this.state.game_map.name}</h6>
                            </div>
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
