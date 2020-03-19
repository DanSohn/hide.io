import React, { Component } from "react";
import Lobby from "./Lobby";
import PlayerProfile from "../PlayerProfile.js";
import Header from "../assets/header";
import Break from "../assets/break";

import "../assets/App.css";


import {socket} from '../assets/socket'

class LobbyScreen extends Component {
    constructor(props) {
        super(props);

        console.log(
            "In lobby selection screen, received the props: ",
            this.props.name,
            this.props.email
        );

        this.state = {
            userName: this.props.name,
            email: this.props.email
        };

        this.createLobby = this.createLobby.bind(this);
    }

    createLobby(){
        socket.emit("create lobby", ({
            username: this.state.userName,
            email: this.state.email,
            settings: "no settings rn"}))
    }

    render() {
        //the idea is, for each record in the lobby database, a new div or list will appear.
        let comp;
        comp = (
            <div className="GameWindow">
                <Header />
                <Break />
                <div className="ContentScreen">
                    <div className="lobbySelection">
                        <p>Shalom</p>
                    </div>
                    <div className="createLobby">
                        <button type="button" className="btn btn-success" onClick={this.createLobby}/>
                    </div>
                </div>
            </div>
        );
        return <div>{comp}</div>;
    }
}
export default LobbyScreen;
