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
            goBack: false,
            previous: false,
            image: this.props.image
        };
        this.goBack = this.goBack.bind(this);
        this.goPrevious = this.goPrevious.bind(this);
    }
    goPrevious() {
        this.setState({
            previous: true
        });
    }
    goBack() {
        this.setState({
            goBack: true
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
                        <div className="menuScreen">
                            <h2>Name: {this.state.userName}</h2>
                            <h2>Email: {this.state.email}</h2>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={this.goBack}
                            >
                                Back
                            </button>
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
