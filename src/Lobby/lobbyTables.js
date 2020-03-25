import React, { Component } from "react";
import { socket } from "../assets/socket";
import "../assets/App.css";


class lobbyTables extends Component {
    constructor(props) {
        super(props);
        console.log("Loading lobbyTables");
        this.state = {
            lobbies: []
        }
    }

    renderTableData(){

    }

    renderTableHeader(){
        let headers = ["Lobby Name", "Players", "Action"];
        return headers.map((key, index) => {
            return <th key={index}>{key}</th>
        });
    }

    componentDidMount() {

    }

    render(){
        return (
            <div className="lobbySelection">
                <table className="lobbyTable">
                    <tr>
                        <th>Lobby Name</th>
                        <th>Players</th>
                        <th>Action</th>
                    </tr>
                    <tr>
                        <td>Noob Master</td>
                        <td>0/6</td>
                        <td>
                            <button
                                className="btn btn-success"
                                onClick={this.goToJoinLobby}>
                                Join
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
        )

    }
}