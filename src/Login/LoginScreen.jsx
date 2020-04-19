import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import googleAuth from './GoogleAuth';
import { auth } from "../Router";
import { socket } from "../assets/socket";
import Cookies from 'universal-cookie';

import Break from "../assets/Break";

import "../assets/App.css";
import Sound from "react-sound";
import ClickSound from "../sounds/click.js";
import Header from "../assets/Header";
import getSong from "../sounds/gameMusic";

const cookies = new Cookies();

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SignIn: false,
            newUser: true,
            userName: "",
            email: "",
            cookieCheck: false,
            errorMsg: "",
            errorTimeout: null

        };

        this.checkExistingCookies = this.checkExistingCookies.bind(this);
    }

    // i will check for existing cookies and ask the server if the email username combination exists
    checkExistingCookies() {
        // if cookies show authentication, then set auth to be true
        if (cookies.get("email") && cookies.get("name") && cookies.get("image")) {
            socket.emit("user exists check", cookies.get("email"));
            this.setState({ cookieCheck: true })
        }

    }

    componentDidMount() {
        this.checkExistingCookies();
        // load the google API and have it ready
        googleAuth.load();

        socket.on("user database check", (username) => {
            if(username === -1){
                // email is already in use, don't go through
                cookies.remove("name");
                cookies.remove("email");
                cookies.remove("image");
                this.setState({
                    errorMsg: "Email is currently in game. Try a different email or talk to your friends and smack em",
                    cookieCheck: false,
                    errorTimeout: setTimeout(()=>{
                        this.setState({errorMsg: "", errorTimeout: null})
                    }, 3000)
                })
                return;
            }
            // i go through this if statement if checkExistingCookies was called
            // if cookies and username does match, i will log right in
            if (this.state.cookieCheck) {
                this.setState({ cookieCheck: false });
                if (username === cookies.get("name")) {
                    auth.login();
                    this.setState({ newUser: false })
                }
            } else {
                // user is now authenticated
                auth.login();
                let googleUser = googleAuth.loginInfo();

                // the cookies last for a maximum time of 1 day
                cookies.set("email", googleUser.email, { path: "/", maxAge: 60 * 60 * 24 });
                cookies.set("image", googleUser.image, { path: "/", maxAge: 60 * 60 * 24 });

                if (username !== null) {
                    cookies.set("name", username, { path: "/", maxAge: 60 * 60 * 24 });
                    this.setState({
                        newUser: false,
                        userName: username,
                        email: googleUser.email,
                    });
                } else {
                    this.setState({
                        email: googleUser.email,
                    });
                }
            }

        });

        socket.on("reconnect", attemptNumber => {
            console.log("Reconnected to server on try", attemptNumber);
            this.setState({
                errorMsg: ""
            })
        });

        socket.on("reconnect_error", (error) => {
            // console.log("Error! Disconnected from server", error);
            console.log("Error! Can't connect to server");
            this.setState({
                errorMsg: "There is an issue with the server. The Top Programmers in the world and daniel are working on it!"
            })
        });
    }

    componentWillUnmount() {
        console.log("Unmounting login screen!");
        socket.off("user database check");
        socket.off("reconnect");
        socket.off("reconnect_error");
    }


    render() {
        let component = null;
        if (!auth.isAuthenticated) {
            component = (
                <div className="GameWindow fade-in-2">
                    <Header title="Login" showProfile={false} showBack={false} />

                    <Break />
                    <div className="ContentScreen">
                        <div className="LoginScreen">
                            <p className="errorMsg">{this.state.errorMsg}</p>
                            <span id="googleLogin" className='start-btn-red ff-20 width-250'>GOOGLE</span>
                        </div>
                    </div>
                </div>
            );
        } else {
            if (this.state.newUser) {
                component = (
                    <Redirect to={{
                        pathname: '/UsernameSelection',
                        /*state: {
                            email: this.state.email,
                        }*/
                    }} />
                );
            } else {
                component = (
                    <Redirect to={{
                        pathname: '/MainMenu',
                        /*state: {
                            name: this.state.userName,
                            email: this.state.email,
                        }*/
                    }} />
                );
            }
        }
        return (
            <div className="fade-in-2">
                {component}
            </div>
        );
    }
}

export { LoginScreen, googleAuth };
