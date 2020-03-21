import React, { Component } from "react";
import Lobby from "./Lobby";
import PlayerProfile from "../PlayerProfile.js";
import Header from "../assets/header";
import Break from "../assets/break";
import { socket } from "../assets/socket";

import "bootstrap/dist/js/bootstrap.bundle";
import "../assets/App.css";
import ViewLobbies from "./viewLobbies";

class CreateLobby extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: this.props.name,
            email: this.props.email,
            previous: false,
            submitted: false,
            image: this.props.image,
            lobbyName:"",
            gameMode:"",
            gameTime:"",
            gameMap: ""
        };
        this.goPrevious = this.goPrevious.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeLobbyName = this.handleChangeLobbyName.bind(this);
        this.handleChangeGameMode = this.handleChangeGameMode.bind(this);
        this.handleChangeGameTime = this.handleChangeGameTime.bind(this);
        this.handleChangeGameMap = this.handleChangeGameMap.bind(this);
    }

    goPrevious() {
        this.setState({
            previous: true
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("Submitting!!!!");
        console.log("i will be providing to the server this information:");
        console.log("lobby name: ", this.state.lobbyName);
        console.log("game mode: ", this.state.gameMode);
        console.log("game time: ", this.state.gameTime);
        console.log("game map: ", this.state.gameMap);

        socket.emit("create lobby", {
            email: this.state.email,
            lobbyName: this.state.lobbyName,
            gameMode: this.state.gameMode,
            gameTime: this.state.gameTime,
            gameMap: this.state.gameMap
        });
        this.setState({
            submitted: true
        });

    }

    handleChangeLobbyName(event){
        this.setState({
            lobbyName: event.target.value
        });
    }
    handleChangeGameMode(event){
        this.setState({
            gameMode: event.target.value
        });
    }
    handleChangeGameTime(event){
        this.setState({
            gameTime: event.target.value
        });
    }
    handleChangeGameMap(event){
        this.setState({
            gameMap: event.target.value
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
        }else if(this.state.submitted){
            comp = (
                <Lobby />

            )
        } else {
            comp = (
                <React.Fragment>
                    <Header
                        previous={this.goPrevious}
                        image={this.props.image}
                    />
                    <Break />
                    <div className="title">
                        <h1>Create Lobby</h1>
                    </div>

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
                                    <input value={this.state.lobbyName} onChange={this.handleChangeLobbyName}
                                           type="text" className="form-control" id="usr" required />
                                    <select value={this.state.gameMode} onChange={this.handleChangeGameMode}
                                            className="browser-default custom-select" required >
                                        <option selected/>
                                        <option value="1">
                                            Lover's Paradise
                                        </option>
                                        <option value="2">
                                            Do you want to build a snowman?
                                        </option>
                                        <option value="3">
                                            Love is an open door
                                        </option>
                                    </select>
                                    <select value={this.state.gameTime} onChange={this.handleChangeGameTime}
                                        className="browser-default custom-select"
                                        required
                                    >
                                        <option selected/>
                                        <option value="1">3 mins</option>
                                        <option value="2">4 mins</option>
                                        <option value="3">5 mins</option>
                                    </select>
                                    <select value={this.state.gameMap} onChange={this.handleChangeGameMap}
                                        className="browser-default custom-select"
                                        required
                                    >
                                        <option selected/>
                                        <option value="1">
                                            Never gonna give you up
                                        </option>
                                        <option value="2">
                                            Never gonna let you down
                                        </option>
                                        <option value="3">
                                            Never gonna run around and desert
                                            you
                                        </option>
                                        <option value="4">
                                            Never gonna make you cry
                                        </option>
                                        <option value="5">
                                            Never gonna say goodbye
                                        </option>
                                        <option value="6">
                                            Never gonna tell a lie and hurt you
                                        </option>
                                    </select>
                                </div>
                                <div className="createLobbyContainer">
                                    <button
                                        type="submit"
                                        className="btn btn-info"
                                    >Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </React.Fragment>
            );
        }
        return <div className="GameWindow">{comp}</div>;
    }
}

export default CreateLobby;
