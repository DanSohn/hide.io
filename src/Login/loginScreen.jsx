import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import googleAuth from './GoogleAuth';
import {auth} from "../Router";
import { socket } from "../assets/socket";
import Cookies from 'universal-cookie';

import Break from "../assets/break";

import "../assets/App.css";
import Sound from "react-sound";
import ClickSound from "../sounds/click.js";

const cookies = new Cookies();

class LoginScreen extends Component {
    constructor(props) {
        console.log("loading loginscreenn... auth is", auth.isAuthenticated);
        super(props);
        this.state = {
            SignIn: false,
            newUser: true,
            userName: "",
            id: "",
            email: "",
            clickStatus: "PAUSED",
        };

        this.playSound = this.playSound.bind(this);
        this.songSelection = Math.floor(Math.random() * 5);
    }

    componentDidMount() {
        console.log("component did mount");
        googleAuth.load();

        socket.on("user database check", (username) => {
            // user is now authenticated
            auth.login();
            let googleUser = googleAuth.loginInfo();

            // the cookies last for a maximum time of 1 day
            cookies.set("email", googleUser.email, { path: "/", maxAge: 60*60*24});
            cookies.set("image", googleUser.image, { path: "/", maxAge: 60*60*24});

            // console.log("checking if user exists");
            // if the user "exists" in database, then not a new user and will go straight to main menu
            // otherwise, go to the username selection
            if (username !== null) {
                console.log("got info from auth ... ", googleUser);
                cookies.set("name", username, { path: "/", maxAge: 60*60*24});
                this.setState({
                    newUser: false,
                    userName: username,
                    email: googleUser.email,
                });
            } else {
                // this else statement is a little redundant since newUser is initialized to be true
                // but for better readability, i'll keep it in
                this.setState({
                    email: googleUser.email,
                });
            }
        });
    }

    componentWillUnmount() {
        console.log("Unmounting login screen!");
        socket.off("user database check");
    }

    /*goToLobby() {
        this.setState({
            SignIn: true,
        });
    }*/


    playSound() {
        ClickSound();
    }

    render() {
        let component = null;
        if (!auth.isAuthenticated) {
            component = (
                <div className="GameWindow">
                    <div className="header">
                        <div className="logo">
                            <h1>Hide.IO</h1>
                        </div>
                    </div>
                    <Break />
                    <div className="ContentScreen">
                        <div className="LoginScreen">
                            <button
                                type="button"
                                id="googleLogin"
                                className="btn btn-danger"
                                >
                                Google
                            </button>

                        </div>
                    </div>
                </div>
            );
        } else {
            if (this.state.newUser) {
                component = <Redirect to={{
                        pathname: '/UsernameSelection',
                        /*state: {
                            email: this.state.email,
                        }*/
                    }}/>;
            } else {
                component = <Redirect to={{
                    pathname: '/MainMenu',
                    /*state: {
                        name: this.state.userName,
                        email: this.state.email,
                    }*/
                }}/>;
            }
        }
        let songURL = "";
        switch (this.songSelection) {
            case 0:
                songURL =
                    "https://vgmdownloads.com/soundtracks/mega-man-bass-gba/pxegwbro/04%20Robot%20Museum.mp3";
                break;
            case 1:
                songURL =
                    "https://vgmdownloads.com/soundtracks/half-life-2-episode-two-rip-ost/itjbtwqb/03.%20Eon%20Trap.mp3";
                break;
            case 2:
                songURL =
                    "https://vgmdownloads.com/soundtracks/uncharted-the-nathan-drake-collection/jpqzmvae/1-01.%20Nate%27s%20Theme.mp3";
                break;
            case 3:
                songURL =
                    "https://vgmdownloads.com/soundtracks/super-smash-bros.-for-nintendo-3ds-and-wii-u-vol-02.-donkey-kong/lsdyorvy/19.%20Swinger%20Flinger.mp3";
                break;
            case 4:
                songURL =
                    "https://vgmdownloads.com/soundtracks/uncharted-the-nathan-drake-collection/jpqzmvae/1-01.%20Nate%27s%20Theme.mp3";
                break;
        }
        return (
            <div className="fade-in-2">
                <Sound
                    volume="60"
                    url={songURL}
                    autoload="true"
                    playStatus={Sound.status.PLAYING}
                    muted="muted"
                    loop="true"
                />
                {component}
            </div>
        );
    }
}

export { LoginScreen, googleAuth };
