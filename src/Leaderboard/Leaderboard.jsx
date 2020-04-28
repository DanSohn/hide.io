import React, { Component } from 'react';
import {socket} from "../assets/socket";
import {auth} from "../assets/auth";
import {removeCookies} from "../assets/utils";
import {googleAuth} from "../Login/LoginScreen";
import ClickSound from "../sounds/click";
import Header from "../assets/Header";
import Break from "../assets/Break";
import {Redirect} from "react-router-dom";

class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previous: false
        }
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
                        Hello

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


export default Leaderboard;