import React, { Component } from "react";
import "./assets/App.css";
import LoginScreen from "./Login/loginScreen";
import { Redirect } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import MenuScreen from "./menuScreen";
import Header from "./assets/header";
import Break from "./assets/break";

class PlayerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: this.props.name,
            email: this.props.email,
            signedIn: true,
            previous: false,
            image: this.props.image
        };
        this.goPrevious = this.goPrevious.bind(this);
    }
    goPrevious() {
        this.setState({
            previous: true
        });
    }

    render() {
        let comp;
        if (!this.state.previous) {
            comp = (
                <div className="GameWindow">
                    <Header
                        previous={this.goPrevious}
                        image={this.state.image}
                    />
                    <Break />
                    <div className="ContentScreen">
                        <div className="profileLabels">
                            <h2>Profile:</h2>
                            <h2>Name:</h2>
                            <h2>Email:</h2>
                            <h2>Win/Loss:</h2>
                            <h2>Total Games:</h2>
                        </div>
                        <div className="profileResults">
                            <input
                                type="text"
                                id="email"
                                className="form-control"
                                placeholder="what goes here?"
                                readOnly
                            ></input>
                            <input
                                type="text"
                                className="form-control"
                                id="userName"
                                placeholder={this.state.userName}
                            ></input>
                            <input
                                type="text"
                                id="email"
                                className="form-control"
                                placeholder={this.state.email}
                                readOnly
                            ></input>
                            <input
                                type="text"
                                id="email"
                                className="form-control"
                                placeholder="200/0"
                                readOnly
                            ></input>
                            <input
                                type="text"
                                id="email"
                                className="form-control"
                                placeholder="I assume wins + loss"
                                readOnly
                            ></input>
                        </div>
                    </div>
                </div>
            );
        } else {
            comp = (
                <MenuScreen
                    name={this.state.userName}
                    email={this.state.email}
                    image={this.state.image}
                />
            );
        }

        return <div>{comp}</div>;
    }
}
export default PlayerProfile;
