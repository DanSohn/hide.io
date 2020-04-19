/**
 *  Lobby Room Component.
 *
 *   Acts as a container for all components that are shown in the lobby room.
 *  This class is in charge of keeping track of how much time is left on the timer before the game begins.
 *  In charge of instantiating the game and passing all necessary states.
 *  In charge of assigning the seeker based on message from server socket.
 *  In charge of assigning starting positions to players.
 *
 */

import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import Cookies from "universal-cookie";

import {socket} from "../assets/socket";
import {auth} from "../assets/auth";
import {googleAuth} from "../Login/LoginScreen";

import Header from "../assets/Header";
import Break from "../assets/Break";
import Chat from "./RoomComponents/Chat";
import GameSettings from "./RoomComponents/GameSettings";
import PlayerList from "./RoomComponents/PlayerList";
import ButtonArea from "./RoomComponents/ButtonArea";

import {returnGameMode, returnGameMap, returnGameTime} from "../assets/utils";
import ClickSound from "../sounds/click";
import Timer from "../sounds/timer";

import "bootstrap/dist/js/bootstrap.bundle";
import "../assets/App.css";

const cookies = new Cookies();

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: cookies.get("name"),
            email: cookies.get("email"),
            roomID: this.props.location.state.join_code,
            title: "",
            header: "Join Code: " + this.props.location.state.join_code,
            playerState: "hider",
            startingPosition: [],
            game_mode: "",
            game_map: {},
            game_time: "",
            start: false,
            players: {},
            playersList: [],
            time: "",
            creator: false,
            error: "",
            errorTimeout: null,
            roomTTL: setInterval(() => {
                console.log("Check if lobby still exists!");
                socket.emit(
                    "does the lobby still exist",
                    this.props.location.state.join_code
                );
            }, 30000) // keep checking if the lobby still exists in db every 5 mins, otherwise leave
        };
        this.goPrevious = this.goPrevious.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.resetLobbyTimer = this.resetLobbyTimer.bind(this);

        // this lets the socket join the specific room
        socket.emit("ask for lobby info", this.state.roomID);

        console.log("check if lobby still exists");
        socket.emit(
            "does the lobby still exist",
            this.props.location.state.join_code
        );

        this.resetLobbyTimer();
    }

    goPrevious() {
        // i ensure everything is first handled properly in the server, and is up to date
        // before i leave

        socket.on("may successfully leave lobby", () => {
            clearInterval(this.state.roomTTL);
            ClickSound();
            this.setState({
                previous: true
            });
        });

        socket.emit("leave lobby", {
            room: this.state.roomID,
            email: this.state.email
        });
    }

    // reset the TTL for the lobby
    resetLobbyTimer() {
        console.log("Action detected. Updating lobby timer");
        socket.emit("reset lobby timer", this.state.roomID);
    }

    startTimer() {
        console.log("Starting timer!");
        // 3 second timer currently
        // TimerSound();
        socket.emit("lobby start timer", {
            countdowntime: 4300,
            room: this.state.roomID
        });
        this.setState({
            creator: true
        });
    }

    componentDidMount() {
        // socket.emit("player joined");
        socket.on("giving lobby info", lobby => {
            if (!lobby) {
                console.log(
                    "Received not a lobby! Check room.js line 101, and server.js line 126"
                );
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
        socket.on("update lobby list", lobby_users => {
            console.log("Received current lobby users ", lobby_users);
            this.setState({
                playersList: lobby_users
            });
        });

        // if the lobby no longer exists (due to inactivity), then leave the lobby
        socket.on("lobby existence", status => {
            // if it doesn't exist
            if (!status) {
                console.log("Lobby no longer exists in DB");
                this.goPrevious();
            } else {
                console.log("Lobby still exists!");
            }
        });

        // i receive the start game timer from server and display it
        socket.on("lobby current timer", countdown => {
            console.log(countdown);
            this.setState({
                time: countdown.toString()
            });
            // TimerSound();
            // after i reach 0, call startGametime lim
            Timer();
            if (countdown <= 0) {
                console.log("starting game");
                this.setState({
                    start: true
                });
            }
        });
        socket.on("youre the seeker", () => {
            this.setState({
                playerState: "seeker"
            });
            console.log("Congrats! Youre the seeker!");
        });

        socket.on("check enough players", status => {
            if (status) {
                this.setState({header: "Game is starting in ..."});
                clearInterval(this.state.roomTTL);
            } else {
                if (this.state.errorTimeout === null) {
                    this.setState({
                        error: "Need at least 2 players to start the game",
                        errorTimeout: setTimeout(() => {
                            this.setState({error: "", errorTimeout: null});
                        }, 3000)
                    });
                } else {
                    clearTimeout(this.state.errorTimeout);
                    this.setState({
                        errorTimeout: setTimeout(() => {
                            this.setState({error: "", errorTimeout: null});
                        }, 3000)
                    });
                }
            }

            socket.on("starting position", (startingX, startingY) => {
                this.setState({startingPosition: [startingX, startingY]});
            });

        });

        // if the server disconnects, go to login screen, remove cookies and sign out of the google account
        socket.on("reconnect_error", error => {
            // console.log("Error! Disconnected from server", error);
            console.log("Error! Can't connect to server");
            auth.logout(() => {
                // reason history is avail on props is b/c we loaded it via a route, which passes
                // in a prop called history always
                cookies.remove("name");
                cookies.remove("email");
                cookies.remove("image");
                googleAuth.signOut();
                console.log("going to logout!");
                this.props.history.push("/");
            });
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.roomTTL);

        socket.off("giving lobby info");
        socket.off("update lobby list");
        socket.off("may successfully leave lobby");
        socket.off("lobby existence");
        socket.off("lobby current timer");
        socket.off("lobby start timer");
        socket.off("youre the seeker");
        socket.off("check enough players");
        socket.off("reconnect_error");
        socket.off("may successfully leave lobby");
    }

    render() {
        let comp;

        if (this.state.previous) {
            comp = (
                <Redirect
                    to={{
                        pathname: "/LobbyScreen"
                    }}
                />
            );
        } else if (this.state.start) {
            comp = (
                <>
                    <Redirect
                        to={{
                            pathname: "/Game",
                            state: {
                                gameID: this.state.roomID,
                                players: this.state.players,
                                playerState: this.state.playerState,
                                startingPosition: this.state.startingPosition,
                                map: this.state.game_map,
                                timeLimit: this.state.game_time,
                                mode: this.state.game_mode,
                                playerUsername: this.state.userName,
                                creator: this.state.creator
                            }
                        }}
                    />
                </>
            );
        } else {
            comp = (
                <div className="GameWindow">
                    <Header previous={this.goPrevious} title={this.state.title}/>
                    <Break/>
                    <div className="ContentScreen">
                        <Chat
                            actionCallback={this.resetLobbyTimer}
                            userName={this.state.userName}
                            roomID={this.state.roomID}
                        />

                        <div className="roomActions">
                            <ButtonArea
                                timerCallback={this.startTimer}
                                actionCallback={this.resetLobbyTimer}
                                header={this.state.header}
                                time={this.state.time}
                                errorMsg={this.state.error}
                            />
                            <GameSettings
                                mode={this.state.game_mode}
                                time={this.state.game_time}
                                map={this.state.game_map.name}
                            />
                        </div>
                        <PlayerList playersList={this.state.playersList}/>
                    </div>
                </div>
            );
        }
        return <>{comp}</>;
    }
}

export default Room;
