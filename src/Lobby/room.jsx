import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import { socket } from "../assets/socket";
import Cookies from 'universal-cookie';

import Header from "../assets/header";
import Break from "../assets/break";
import Chat from "./chat";

import { returnGameMode, returnGameMap, returnGameTime } from "../assets/utils";
import "bootstrap/dist/js/bootstrap.bundle";
import "../assets/App.css";
import ClickSound from "../sounds/click";

const cookies = new Cookies();

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            /*userName: this.props.location.state.name,
            email: this.props.location.state.email,
            */
            userName: cookies.get("name"),
            email: cookies.get("email"),
            roomID: this.props.location.state.join_code,
            title: "",
            header: "Join Code: " + this.props.location.state.join_code,
            game_mode: "",
            game_map: {},
            game_time: "",
            start: false,
            players: {},
            playersList: [],
            time: ""
        };
        this.goPrevious = this.goPrevious.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.start = this.start.bind(this);
        
        // this lets the socket join the specific room
        socket.emit("ask for lobby info", this.state.roomID);
    }

    goPrevious() {
        socket.emit("leave lobby", { room: this.state.roomID, email: this.state.email });
        // i ensure everything is first handled properly in the server, and is up to date
        // before i leave
        socket.on("may successfully leave lobby", ()=>{
            ClickSound();
            this.setState({
                previous: true
            });
        })
    }

    startTimer() {
        // 3 second timer currently
        // TimerSound();
        socket.emit("lobby start timer", {countdowntime: 4300, room: this.state.roomID});

        this.setState({
            header: "Game is starting in ..."
        })
    }

    start() {
        this.setState({
            start: true,
        });
    }

    componentDidMount() {
        // socket.emit("player joined");
        socket.on("giving lobby info", (lobby) => {
            if (!lobby) {
                console.log("Received not a lobby! Check room.js line 54, and server.js line 119");
            }else{
                console.log("Received lobby info", lobby);
                this.setState({
                    title: lobby.lobby_name,
                    game_mode: returnGameMode(lobby.game_mode),
                    game_time: returnGameTime(lobby.game_time),
                    game_map: returnGameMap(lobby.game_map),
                    playersList: lobby.players
                });
                console.log(this.state.game_map);
            }
        });
        // everytime this event is called, its passed a set of the users in the lobby
        // parameter: lobby_users - a SET containing all the users username
        socket.on("update lobby list", (lobby_users) => {
            console.log("Received current lobby users ", lobby_users);
            this.setState({
                playersList: lobby_users,
            });
        });
        
        socket.on("lobby current timer", (countdown) => {
            console.log(countdown);
            this.setState({
                time: countdown.toString()
            });
            // TimerSound();
            // after i reach 0, call startGame
            if (countdown <= 0) {
                console.log("starting game");
                this.start();
            }
        });
        socket.on('youre the seeker', ()=> {this.state.playerState = 'seeker'; console.log("Congrats! Youre the seeker!")});
    }

    componentWillUnmount() {
        console.log("Room unmounting...");
        socket.off("giving lobby info");
        socket.off("update lobby list");
        socket.off("lobby current timer");
        socket.off("lobby start timer");

    }

    render() {
        console.log("rendering in ROOM");
        let comp;

        if (this.state.previous) {
            comp = <Redirect to={{
                pathname: '/LobbyScreen',
                /*state: {
                    name: this.state.userName,
                    email: this.state.email,
                }*/
            }}/>
        } else if (this.state.start) {
            comp = <Redirect to={{
                pathname: '/Game',
                state: {
                    gameID: this.state.roomID,
                    players: this.state.players,
                    playerState: this.state.playerState,
                    map: this.state.game_map,
                    timeLimit: this.state.game_time,
                    mode: this.state.game_mode
                }
            }}/>

        } else {
            comp = (
                <div className="GameWindow">
                    <Header
                        previous={this.goPrevious}
                        title={this.state.title}
                    />
                    <Break />
                    <div className="ContentScreen">
                        <Chat userName={this.state.userName} roomID={this.state.roomID}/>

                        <div className="roomActions">
                            <h5>{this.state.header}</h5>
                            <h1>{this.state.time}</h1>
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
                                <h6>{this.state.game_map["name"]}</h6>
                            </div>
                        </div>
                        <div className="online">
                            <ul>
                                {this.state.playersList.map((player, index) => {
                                    return <li style={{ listStyleType: "none" }} key={index}>{player.name}</li>;
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }
        return <>{comp}</>;
    }
}

export default Room;
