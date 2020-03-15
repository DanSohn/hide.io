import React, { Component } from "react";
import Lobby from "./Lobby/Lobby";

class MenuScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: 0
        };
        this.goToPlayScreen = this.goToPlayScreen.bind(this);
        this.goToInstructions = this.goToInstructions.bind(this);
        this.goToLogout = this.goToLogout.bind(this);
        this.goToProfile = this.goToProfile.bind(this);
    }
    goToPlayScreen() {
        this.setState(state => ({
            stage: 2
        }));
    }
    goToInstructions() {
        this.setState(state => ({
            stage: 2
        }));
    }
    goToProfile() {
        this.setState(state => ({
            stage: 3
        }));
    }
    goToLogout() {
        this.setState(state => ({
            stage: 4
        }));
    }

    render() {
        let comp;
        if (this.state.stage === 0) {
            comp = (
                <div className="GameWindow">
                    <div className="menuScreen">
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={this.goToPlayScreen}
                        >
                            Play
                        </button>
                        <br></br>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={this.goToInstructions}
                        >
                            Instructions
                        </button>
                        <br></br>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={this.goToProfile}
                        >
                            Profile
                        </button>
                        <br></br>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={this.goToLogout}
                        >
                            Logout
                        </button>
                        <br></br>
                    </div>
                </div>
            );
        } else if (this.state.stage === 1) {
            comp = <Lobby />;
        } else if (this.state.stage === 2) {
            comp = <Lobby />;
        } else if (this.state.stage === 3) {
            comp = <Lobby />;
        } else if (this.state.stage === 4) {
            comp = <Lobby />;
        }
        return <div>{comp}</div>;
    }
}
export default MenuScreen;
