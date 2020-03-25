import React, {Component} from "react";
import {socket} from "../assets/socket";
import "../assets/App.css";
import ViewLobbies from "./viewLobbies";


class LobbyTables extends Component {
    constructor(props) {
        super(props);
        console.log("Loading lobbyTables");
        // lobbies state is an array of lobby objects, received from the database from server
        this.state = {
            lobbies: []
        }
    }

    renderTableData() {
        if(this.state.lobbies === null){
            return;
        }

        return this.state.lobbies.map((lobby) => {
            // CURRENTLY JUST UTILIZING ALL THE INFORMATION, HOWEVER IN THE END IF I DON'T NEED
            // THEN REMOVE THE CONSTANTS THAT IS NOT USED
            const {join_code, creator_email, lobby_name, game_mode, game_time, game_map} = lobby;
            return (
                <tr key={join_code}>
                    <td>{lobby_name}</td>
                    <td>Capacity</td>
                    <td>
                        <button
                            className="btn btn-success"
                            >
                            Join
                        </button>
                    </td>
                </tr>
            )
        })

    }

    renderTableHeader() {
        let headers = ["Lobby Name", "Players", "Action"];
        return headers.map((key, index) => {
            return <th key={index}>{key}</th>
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        socket.on("receive lobby list", (lobbies) => {
            console.log("Recieved list of lobbies", lobbies);
            this.setState({
                lobbies: lobbies
            });
            console.log(this.state.lobbies);
        })
    }

    componentDidMount() {
        console.log("componentdidmount");

        socket.emit("please give lobbies");

        socket.on("receive lobby list", (lobbies) => {
            console.log("Recieved list of lobbies", lobbies);
            this.setState({
                lobbies: lobbies
            });
            console.log(this.state.lobbies);
        })
    }

    render() {
        return (
            <div className="lobbySelection">
                <table className="lobbyTable">
                    <tbody>
                        <tr>{this.renderTableHeader()}</tr>
                        {this.renderTableData()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default LobbyTables;
