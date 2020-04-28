import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { socket } from "../assets/socket";

import Header from "../assets/Header";
import Break from "../assets/Break";

import "bootstrap/dist/js/bootstrap.bundle";
import "../assets/App.css";
import ClickSound from "../sounds/click";
import { auth } from "../assets/auth";
import { googleAuth } from "../Login/LoginScreen";
import {getCookiesInfo, removeCookies} from "../assets/utils";


class CreateLobby extends Component {
    constructor(props) {
        super(props);
        const cookiesInfo = getCookiesInfo();
        this.state = {
            userName: cookiesInfo.name,
            email: cookiesInfo.email,
            previous: false,
            submitted: false,
            lobbyName: "",
            gameMode: "",
            gameTime: "",
            gameMap: "",
            roomID: "",
        };
        this.goPrevious = this.goPrevious.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeLobbyName = this.handleChangeLobbyName.bind(this);
        this.handleChangeGameMode = this.handleChangeGameMode.bind(this);
        this.handleChangeGameTime = this.handleChangeGameTime.bind(this);
        this.handleChangeGameMap = this.handleChangeGameMap.bind(this);
    }

    componentDidMount() {
        socket.on("reconnect_error", () => {
            // console.log("Error! Disconnected from server", error);
            console.log("Error! Can't connect to server");
            auth.logout(() => {
                // reason history is avail on props is b/c we loaded it via a route, which passes
                // in a prop called history always
                removeCookies();
                googleAuth.signOut();
                console.log("going to logout!");
                this.props.history.push('/');
            });
        });
    }

    componentWillUnmount() {
        socket.off("reconnect_error");
        ClickSound();
        socket.off("created lobby return code");
    }

    goPrevious() {
        this.setState({
            previous: true,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("i will be providing to the server this information:");
        console.log("lobby name: ", this.state.lobbyName);
        console.log("game mode: ", this.state.gameMode);
        console.log("game time: ", this.state.gameTime);
        console.log("game map: ", this.state.gameMap);

        socket.emit("create lobby", {
            email: this.state.email,
            name: this.state.userName,
            lobbyName: this.state.lobbyName,
            gameMode: this.state.gameMode,
            gameTime: this.state.gameTime,
            gameMap: this.state.gameMap,
        });

        socket.on("created lobby return code", (code) => {
            this.setState({
                roomID: code,
                submitted: true,
            });
        });
    }

    handleChangeLobbyName(event) {
        this.setState({
            lobbyName: event.target.value,
        });
    }

    handleChangeGameMode(event) {
        ClickSound();
        this.setState({
            gameMode: event.target.value,
        });
    }

    handleChangeGameTime(event) {
        ClickSound();
        this.setState({
            gameTime: event.target.value,
        });
    }

    handleChangeGameMap(event) {
        ClickSound();
        this.setState({
            gameMap: event.target.value,
        });
    }

    render() {
        let comp;
        if (this.state.previous) {
            comp = <Redirect to='/LobbyScreen' />
        } else if (this.state.submitted) {
            comp = <Redirect to={{
                pathname: '/Room',
                state: {
                    join_code: this.state.roomID
                }
            }} />
        } else {
            comp = (
                <div className="GameWindow">
                    <Header
                        previous={this.goPrevious}
                        title="Create a Lobby"
                    />
                    <Break />
                    <div className="ContentScreen">
                        <div className="createLobbyText">
                            <h2>Name</h2>
                            <h2>Game Mode</h2>
                            <h2>Time</h2>
                            <h2>Map</h2>
                        </div>
                        <div className="createLobbyForm">
                            <form onSubmit={this.handleSubmit}>
                                <div className="createLobbyContainer0">
                                    <div className="createLobbyContainer">
                                        <input
                                            value={this.state.lobbyName}
                                            onChange={this.handleChangeLobbyName}
                                            maxLength="20"
                                            type="text"
                                            className="form-control"
                                            id="usr"
                                            required
                                        />
                                        <select
                                            value={this.state.gameMode}
                                            onChange={this.handleChangeGameMode}
                                            className="browser-default custom-select"
                                            required>
                                            <option defaultValue />
                                            <option value="1">Regular</option>
                                        </select>
                                        <select
                                            value={this.state.gameTime}
                                            onChange={this.handleChangeGameTime}
                                            className="browser-default custom-select"
                                            required>
                                            <option defaultValue />
                                            <option value="0">1 mins</option>
                                            <option value="1">3 mins</option>
                                            <option value="2">4 mins</option>
                                            <option value="3">5 mins</option>
                                        </select>
                                        <select
                                            value={this.state.gameMap}
                                            onChange={this.handleChangeGameMap}
                                            className="browser-default custom-select"
                                            required>
                                            <option defaultValue />
                                            <option value="1">Small</option>
                                            <option value="2">Medium</option>
                                            <option value="3">Large</option>
                                        </select>
                                    </div>
                                    <div className="createLobbyContainer">
                                        <button type="submit"><span className='start-btn-blue ff-20 width-250'>SUBMIT</span></button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
        return <>{comp}</>;
    }
}

export default CreateLobby;
