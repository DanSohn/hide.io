import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import Cookies from "universal-cookie";

import Header from "../assets/Header";
import Break from "../assets/Break";

import "../assets/App.css";
import ClickSound from "../sounds/click";
import {socket} from "../assets/socket";
import {auth} from "../assets/auth";
import {googleAuth} from "../Login/LoginScreen";
import ProfileLabels from "./ProfileLabels";
import ProfileResults from "./ProfileResults";

const cookies = new Cookies();

class PlayerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            /*userName: this.props.location.state.name,
            email: this.props.location.state.email
            */
            userName: cookies.get("name"),
            email: cookies.get("email"),
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
                cookies.remove("name");
                cookies.remove("email");
                cookies.remove("image");
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
                <div className="z-depth-5 GameWindow">
                    <Header
                        previous={this.goPrevious}
                        title="Profile"
                    />
                    <Break/>
                    <div className="ContentScreen">
                        <ProfileLabels />
                        <ProfileResults
                            email={this.state.email}
                            name={this.state.userName}
                        />
                    </div>
                </div>
            );
        } else {
            comp = (
                <Redirect to={{
                    pathname: '/MainMenu',
                    /*state: {
                        name: this.state.userName,
                        email: this.state.email,
                    }*/
                }}/>
            );

        }

        return <>{comp}</>;
    }
}

export default PlayerProfile;
