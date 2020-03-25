import React, { Component } from "react";
import Lobby from "./Lobby";
import PlayerProfile from "../PlayerProfile.js";
import Header from "../assets/header";
import Break from "../assets/break";
import MenuScreen from "../menuScreen";
import CreateLobby from "./createLobby";
import Room from "./room";
import lobbyTables from "./lobbyTables";

import "../assets/App.css";
import { socket } from "../assets/socket";



class ViewLobbies extends Component {
    constructor(props) {
        super(props);

        console.log(
            "In lobby selection screen, received the props: ",
            this.props.name,
            this.props.email
        );

        this.state = {
            userName: this.props.name,
            email: this.props.email,
            previous: false,
            image: this.props.image,
            stage: 0
        };

        this.createLobby = this.createLobby.bind(this);
        this.goPrevious = this.goPrevious.bind(this);
        this.goToCreateLobby = this.goToCreateLobby.bind(this);
        this.goToJoinLobby = this.goToJoinLobby.bind(this);
        //this.goToJoinCode = this.goToJoinCode.bind(this);
    }

    createLobby() {
        socket.emit("create lobby", {
            userName: this.state.userName,
            email: this.state.email,
            settings: "no settings rn"
        });
    }
    goPrevious() {
        this.setState({
            previous: true
        });
    }
    goToCreateLobby() {
        this.setState({
            stage: 1
        });
    }

    goToJoinCode() {
        this.setState({
            stage: 2
        });
    }
    goToJoinLobby() {
        this.setState({
            stage: 3
        });
    }

    render() {
        //the idea is, for each record in the lobby database, a new div or list will appear.
        let comp;
        if (this.state.previous) {
            comp = (
                <MenuScreen
                    email={this.state.email}
                    name={this.state.userName}
                    image={this.state.image}
                />
            );
        } else if (this.state.stage === 1) {
            comp = (
                <CreateLobby
                    name={this.state.userName}
                    email={this.state.email}
                    image={this.state.image}
                />
            );
        } else if (this.state.stage === 2) {
            //<JoinCode />;
        } else if (this.state.stage === 3) {
            comp = (
                <Room
                    name={this.state.userName}
                    email={this.state.email}
                    image={this.state.image}
                />
            );
        } else if (this.state.stage === 0) {
            comp = (
                <div className="GameWindow">
                    <Header
                        previous={this.goPrevious}
                        image={this.props.image}
                    />
                    <Break />
                    <div className="ContentScreen">
                        <lobbyTables />
                        <div className="createLobby">
                            {/* <button
                                type="button"
                                className="btn btn-success"
                                onClick={this.createLobby}
                            /> */}
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={this.goToCreateLobby}>
                                CREATE LOBBY
                            </button>
                            <button type="button" className="btn btn-info">
                                JOIN BY CODE
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return <div>{comp}</div>;
    }
}
export default ViewLobbies;
