import React, { Component } from "react";
import { socket } from "../assets/socket";
import "../assets/App.css";
import ClickSound from "../sounds/click";

class LobbyTables extends Component {
    constructor(props) {
        super(props);
        console.log("Loading lobbyTables");
        // lobbies state is an array of lobby objects, received from the database from server
        this.state = {
            lobbies: []
        };

        this.sendLobbyCode = this.sendLobbyCode.bind(this);

        socket.emit("please give lobbies");

    }

    sendLobbyCode(join_code) {
        console.log("Sending back information to viewLobbies", join_code);
        this.props.lobbyCallback(join_code);
    }


    renderTableData() {
        console.log("re render table data");
        if (this.state.lobbies === null) {
            return;
        }
        return this.state.lobbies.map((lobby) => {
            const { join_code, lobby_name, players } = lobby;
            let num_players = players.length;
            return (
                <tr key={join_code}>
                    <td>{lobby_name}</td>
                    <td>{num_players}</td>
                    <td className="buttonColumn">
                        {/* <button
                            className="btn btn-success"
                            onClick={() => this.sendLobbyCode(join_code)}
                        >
                            Join
                        </button> */}
                        <span onClick={() => this.sendLobbyCode(join_code)} className='start-btn-green ff-10 width-100'>JOIN</span>
                    </td>
                </tr>
            )
        })

    }

    renderTableHeader() {
        return (
            <>
                <th className="largeColumn">Lobby Name</th>
                <th className="smallColumn">Players</th>
                <th className="mediumColumn">Action</th>
            </>);
        // let headers = ["Lobby Name", "Players", "Action"];
        // return headers.map((key, index) => {
        //     if (key === "Players") {
        //         return <th className="smallColumn" key={index}>{key}</th>
        //     } else if (key === "Lobby Name") {
        //         return <th className="largeColumn" key={index}>{key}</th>
        //     } else if (key === "Action") {
        //         return <th className="buttonColumn" key={index}>{key}</th>
        //     }
        // });
    }

    componentDidMount() {
        socket.on("receive lobby list", (lobbies) => {
            console.log("Recieved list of lobbies", lobbies);
            this.setState({
                lobbies: lobbies
            });
            console.log(this.state.lobbies);
        })
    }

    componentWillUnmount() {
        socket.off("receive lobby list");
        ClickSound();
    }

    render() {
        console.log("render table");
        return (
            <div className="start-btn-windows lobbySelection">
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
