import React, { Component } from "react";
import Lobby from "./Lobby/Lobby";
import "./assets/App.css";
import PlayerProfile from "./PlayerProfile.js";
import ViewLobbies from "./Lobby/viewLobbies";
import { auth } from "./Router";
import Header from "./assets/header";
import Break from "./assets/break";
import ClickSound from "./sounds/click";

class MenuScreen extends Component {
    constructor(props) {
        super(props);

        console.log("In menu screen, received the props: ", this.props.location.state.name, this.props.location.state.email);
        this.state = {
            stage: 0,
            userName: this.props.location.state.name,
            email: this.props.location.state.email,
            image: this.props.location.state.image,
        };
        this.goToPlayScreen = this.goToPlayScreen.bind(this);
        this.goToInstructions = this.goToInstructions.bind(this);
        this.goToLogout = this.goToLogout.bind(this);
        this.goToProfile = this.goToProfile.bind(this);
    }
    goToPlayScreen() {
        ClickSound();
        this.setState((state) => ({
            stage: 1,
        }));
    }
    goToInstructions() {
        ClickSound();
        this.setState((state) => ({
            stage: 2,
        }));
    }
    goToProfile() {
        ClickSound();
        this.setState((state) => ({
            stage: 3,
        }));
    }
    goToLogout() {
        ClickSound();
        // this.setState(state => ({
        //     stage: 4
        // }));
        localStorage.clear();
        window.location.href = "/";
    }

    render() {
        let comp;
        if (this.state.stage === 0) {
            comp = (
                <div className="GameWindow">
                    <Header showBack={false} image={this.state.image} />
                    <Break />
                    <div className="ContentScreen">
                        <div className="menuScreen">
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={this.goToPlayScreen}>
                                Play
                            </button>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={this.goToInstructions}>
                                Instructions
                            </button>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={this.goToProfile}>
                                Profile
                            </button>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={()=>{
                                    // this.goToLogout;
                                    auth.logout(()=>{
                                        // reason history is avail on props is b/c we loaded it via a route, which passes
                                        // in a prop called history always
                                        this.props.history.push('/');
                                    });
                                }}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.stage === 1) {
            comp = (
                <ViewLobbies
                    name={this.state.userName}
                    email={this.state.email}
                    image={this.state.image}
                />
            );
        } else if (this.state.stage === 2) {
            comp = <Lobby />;
        } else if (this.state.stage === 3) {
            comp = (
                <PlayerProfile
                    name={this.state.userName}
                    email={this.state.email}
                    image={this.state.image}
                />
            );
        } else if (this.state.stage === 4) {
            comp = <Lobby />;
        }
        return <div>{comp}</div>;
    }
}
export default MenuScreen;
