import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Cookies from 'universal-cookie';

import { socket } from "../assets/socket";
import { auth } from "../assets/auth";
import { googleAuth } from "../Login/LoginScreen";

import Header from "../assets/Header";
import Break from "../assets/Break";
import Chat from "./RoomComponents/Chat";
import GameSettings from "./RoomComponents/GameSettings";
import PlayerList from "./RoomComponents/PlayerList";
import ButtonArea from "./RoomComponents/ButtonArea";

import { returnGameMode, returnGameMap, returnGameTime } from "../assets/utils";
import ClickSound from "../sounds/click";
import "bootstrap/dist/js/bootstrap.bundle";
import "../assets/App.css";

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
            playerState: 'hider',
            game_mode: "",
            game_map: {},
            game_time: "",
            start: false,
            players: {},
            playersList: [],
            time: "",
        };
        this.goPrevious = this.goPrevious.bind(this);
        this.startTimer = this.startTimer.bind(this);

        // this lets the socket join the specific room
        socket.emit("ask for lobby info", this.state.roomID);
    }

    goPrevious() {
        socket.emit("leave lobby", { room: this.state.roomID, email: this.state.email });
        // i ensure everything is first handled properly in the server, and is up to date
        // before i leave
        socket.on("may successfully leave lobby", () => {
            ClickSound();
            this.setState({
                previous: true
            });
        })
    }

    startTimer() {
        console.log("Starting timer!");
        // 3 second timer currently
        // TimerSound();
        socket.emit("lobby start timer", { countdowntime: 4300, room: this.state.roomID });
    }


    componentDidMount() {
        // socket.emit("player joined");
        socket.on("giving lobby info", (lobby) => {
            if (!lobby) {
                console.log("Received not a lobby! Check room.js line 54, and server.js line 119");
            } else {
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

        // this event occurs on function startTimer(), it will count down from 3 to start the game
        socket.on("game starting ack", () => {
            socket.emit("lobby start timer", { countdowntime: 4100, room: this.state.roomID });
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
                this.setState({
                    start: true
                })
            }
        });
        socket.on('youre the seeker', () => {
            this.setState({
                playerState: "seeker"
            })
            console.log("Congrats! Youre the seeker!")
        });

        socket.on('enough peeps', ()=>
            this.setState({ header: "Game is starting in ..."}));

        socket.on('not enough peeps', ()=>
            this.setState({ header: "Not Enough Players to Begin the Game"}));

        // if the server disconnects, go to login screen, remove cookies and sign out of the google account
        socket.on("reconnect_error", (error) => {
            // console.log("Error! Disconnected from server", error);
            console.log("Error! Can't connect to server");
            auth.logout(() => {
                // reason history is avail on props is b/c we loaded it via a route, which passes
                // in a prop called history always
                /*cookies.remove("name");
                cookies.remove("email");
                cookies.remove("image");*/
                googleAuth.signOut();
                console.log("going to logout!");
                this.props.history.push('/');
            });
        });
    }

    componentWillUnmount() {
        socket.off("giving lobby info");
        socket.off("update lobby list");
        socket.off("lobby current timer");
        socket.off("lobby start timer");
        socket.off("not enough peeps");
        socket.off("enough peeps")
        socket.off("reconnect_error");

    }

    render() {
        let comp;
        console.log("THIS IS STATE BEFORE SENDING TO GAME",this.state.playerState)
        if (this.state.previous) {
            comp = (
                <Redirect to={{
                    pathname: '/LobbyScreen',
                    /*state: {
                        name: this.state.userName,
                        email: this.state.email,
                    }*/
                }} />
            );
        } else if (this.state.start) {
            comp = (
                <Redirect to={{
                pathname: '/Game',
                state: {
                    gameID: this.state.roomID,
                    players: this.state.players,
                    playerState: this.state.playerState,
                    map: this.state.game_map,
                    timeLimit: this.state.game_time,
                    mode: this.state.game_mode,
                    playerUsername: this.state.userName
                }
            }}/>

            );

        } else {
            comp = (
                <div className="z-depth-5 GameWindow">
                    <Header
                        previous={this.goPrevious}
                        title={this.state.title}
                    />
                    <Break />
                    <div className="ContentScreen">
                        <Chat userName={this.state.userName} roomID={this.state.roomID} />

                        <div className="roomActions">
                            <ButtonArea
                                timerCallback={this.startTimer}
                                header={this.state.header}
                                time={this.state.time}
                            />
                            <GameSettings
                                mode={this.state.game_mode}
                                time={this.state.game_time}
                                map={this.state.game_map.name}
                            />
                        </div>
                        <PlayerList playersList={this.state.playersList} />
                    </div>
                </div>
            );
        }
        return <>{comp}</>;
    }
}

export default Room;
