import React, { Component } from "react";
import Lobby from "./Lobby/Lobby";
import PlayerProfile from "./PlayerProfile.js";

class LobbyScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        //the idea is, for each record in the lobby database, a new div or list will appear.
        let comp;
        comp = (
            <div className="GameWindow">
                <div className="lobbySelection"></div>
                <div className="createLobby"></div>
            </div>
        );
        return <div>{comp}</div>;
    }
}
export default LobbyScreen;
