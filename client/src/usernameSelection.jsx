import React, { Component } from "react";
import Lobby from "./Lobby/Lobby";

class UsernameSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: ""
        };
        this.goToLobby = this.goToLobby.bind(this);
    }
    goToLobby() {
        this.setState(state => ({
            username: "notnull"
        }));
    }

    render() {
        let comp;
        if (this.state.username === "") {
            comp = (
                <div className="GameWindow">
                    <div className="usernameSelection">
                        <h1>Hide.IO</h1>
                        <h2>Choose GamerTag</h2>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Ali Alkhazaly"
                        />
                        <br></br>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={this.goToLobby}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            );
        } else {
            comp = <Lobby />;
        }
        return <div>{comp}</div>;
    }
}
export default UsernameSelection;
