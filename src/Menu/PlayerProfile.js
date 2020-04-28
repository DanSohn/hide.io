import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import Header from "../assets/Header";
import Break from "../assets/Break";

import "../assets/App.css";
import ClickSound from "../sounds/click";
import { socket } from "../assets/socket";
import { auth } from "../assets/auth";
import { googleAuth } from "../Login/LoginScreen";
import ProfileResults from "./ProfileResults";
import {getCookiesInfo, removeCookies} from "../assets/utils";


class PlayerProfile extends Component {
    constructor(props) {
        super(props);
        const cookiesInfo = getCookiesInfo();
        this.state = {
            userName: cookiesInfo.name,
            email: cookiesInfo.email,
            signedIn: true,
            previous: false,
        };
        this.goPrevious = this.goPrevious.bind(this);
    }

    componentDidMount() {
        socket.on("reconnect_error", (error) => {
            // console.log("Error! Disconnected from server", error);
            console.log("Error! Can't connect to server");
            auth.logout(() => {
                // reason history is avail on props is b/c we loaded it via a route, which passes
                // in a prop called history always
                removeCookies();
                googleAuth.signOut();
                console.log("going to logout!");
                this.props.history.push('/');
            });
        });

    }

    componentWillUnmount() {
        socket.off("reconnect_error");
    }

    goPrevious() {
        ClickSound();
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
                        title="Profile"
                    />
                    <Break />
                    <div className="ContentScreen">
                        <ProfileResults name={this.state.userName} email={this.state.email} />

                    </div>
                </div>
            );
        } else {
            comp = (
                <Redirect to="/MainMenu" />
            );

        }

        return <>{comp}</>;
    }
}

export default PlayerProfile;
