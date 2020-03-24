import React, { Component } from "react";
import Lobby from "./Lobby";
import PlayerProfile from "../PlayerProfile.js";
import Header from "../assets/header";
import Break from "../assets/break";
import { socket } from "../assets/socket";

import "bootstrap/dist/js/bootstrap.bundle";
import "../assets/App.css";
import ViewLobbies from "./viewLobbies";

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: this.props.name,
            email: this.props.email,
            image: this.props.image,
            title: "Room Name should be from database?",
            start: false
        };
        this.goPrevious = this.goPrevious.bind(this);
    }

    goPrevious() {
        this.setState({
            previous: true
        });
    }
    start() {}

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
        } else if (this.state.start) {
        } else {
            comp = (
                <div className="GameWindow">
                    <Header
                        previous={this.goPrevious}
                        image={this.state.image}
                        title={this.state.title}
                    />
                    <Break />
                    <div className="ContentScreen">
                        <div className="chatRoom">
                            <div class="chat">
                                <ul id="messages"></ul>
                            </div>
                            <div class="inputBox">
                                <input id="m" autocomplete="off" />
                                <button>Send</button>
                            </div>
                        </div>

                        <div className="roomActions">
                            <button className="btn btn-success">
                                Start Game
                            </button>
                            <h3>Game Mode:</h3>
                            <h6>love</h6>
                            <h3>Time Limit:</h3>
                            <h6>love</h6>
                            <h3>Map:</h3>
                            <h6>love</h6>
                        </div>
                        <div className="online"> </div>
                    </div>
                </div>
            );
        }
        return <React.Fragment>{comp}</React.Fragment>;
    }
}
export default Room;
