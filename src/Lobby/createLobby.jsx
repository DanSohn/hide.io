import React, { Component } from "react";
import Lobby from "./Lobby";
import PlayerProfile from "../PlayerProfile.js";
import Header from "../assets/header";
import Break from "../assets/break";
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
            image: this.props.image
        };
        this.goPrevious = this.goPrevious.bind(this);
        this.addNewLobby = this.addNewLobby.bind(this);
    }

    goPrevious() {
        this.setState({
            previous: true
        });
    }

    addNewLobby() {
        this.setState({
            previous: true
        });
    }

    render() {
        let comp;
        if (this.state.previous) {
            comp = (
                <ViewLobbies
                    email={this.state.email}
                    name={this.state.username}
                    image={this.state.image}
                />
            );
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
                        <form onSubmit={this.addNewLobby}>
                            <div className="createLobbyContainer0">
                                <div className="createLobbyContainer">
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="usr"
                                        required
                                    ></input>
                                    <select
                                        className="browser-default custom-select"
                                        required
                                    >
                                        <option selected></option>
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
                                    <select
                                        className="browser-default custom-select"
                                        required
                                    >
                                        <option selected></option>
                                        <option value="1">3 mins</option>
                                        <option value="2">4 mins</option>
                                        <option value="3">5 mins</option>
                                    </select>
                                    <select
                                        className="browser-default custom-select"
                                        required
                                    >
                                        <option selected></option>
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
                                    >
                                        Submit
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
