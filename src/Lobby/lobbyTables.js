import React, {Component} from "react";
import {socket} from "../assets/socket";
import "../assets/App.css";


class lobbyTables extends Component {
    constructor(props) {
        super(props);
        console.log("Loading lobbyTables");
        socket.emit("please give lobbies");
        // lobbies state is the lobby object, received from the database from server
        this.state = {
            lobbies: {}
        }
    }

    renderTableData() {


        /*<tr>
            <td>Noob Master</td>
            <td>0/6</td>
            <td>
                <button
                    className="btn btn-success"
                    onClick={this.goToJoinLobby}>
                    Join
                </button>
            </td>
        </tr>*/
    }

    renderTableHeader() {
        let headers = ["Lobby Name", "Players", "Action"];
        return headers.map((key, index) => {
            return <th key={index}>{key}</th>
        });
    }

    componentDidMount() {
        socket.on("receive lobby list", (lobbies) => {
            console.log("Recieved list of lobbies");
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