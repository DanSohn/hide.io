import React, { Component } from "react";

import { socket } from "../assets/socket";
import "../assets/App.css";
import UsernameSelection from "./usernameSelection";
import MenuScreen from "../menuScreen";
import Header from "../assets/header";
import Break from "../assets/break";
import FacebookLogin from "react-facebook-login";
import GitHubLogin from "react-github-login";
import Sound from "react-sound"
import { wait } from "@testing-library/dom";

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SignIn: false,
            newUser: true,
            userName: "",
            id: "",
            email: "",
            image: "",
            clickStatus: "PAUSED"
        };
        this.goToLobby = this.goToLobby.bind(this);
        this.googleSDK = this.googleSDK.bind(this);
        this.prepareLoginButton = this.prepareLoginButton.bind(this);
        this.fbDta = this.fbDta.bind(this);
        this.ghData = this.ghData.bind(this);
        this.ghFail = this.ghFail.bind(this);
        this.playSound = this.playSound.bind(this);
        this.soundButton = new Audio("https://www.pacdv.com/sounds/domestic_sound_effects/light-switch-1.wav")
    }

    componentDidMount() {
        console.log("component did mount!");
        this.googleSDK();

        socket.on("user database check", username => {
            console.log("checking if user exists");
            // if the user "exists" in database, then not a new user and will go straight to main menu
            // otherwise, go to the username selection
            if (username !== "") {
                this.setState({
                    newUser: false,
                    userName: username
                });
            } else {
                // this else statement is a little redundant since newUser is initialized to be true
                // but for better readability, i'll keep it in
                this.setState({
                    newUser: true
                });
            }
            this.goToLobby();
        });
        
    }

    goToLobby() {
        this.setState(state => ({
            SignIn: true
        }));
    }

    googleSDK() {
        window["googleSDKLoaded"] = () => {
            window["gapi"].load("auth2", () => {
                this.auth2 = window["gapi"].auth2.init({
                    client_id:
                        "855332695584-bdpq7iidn0g11ehf2l3h5r3s61cs922m.apps.googleusercontent.com",
                    cookiepolicy: "single_host_origin",
                    scope: "profile email"
                });
                this.prepareLoginButton();
            });
            // this.prepareLoginButton();
            // this.auth2.then(() => {
            //     this.setState({
            //       SignIn: this.auth2.isSignedIn.get(),
            //     });
            //   });
            //   });
        };

        (function(d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src =
                "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, "script", "google-jssdk");
    }

    prepareLoginButton = () => {
        console.log(this.refs.googleLoginBtn);

        this.auth2.attachClickHandler(
            this.refs.googleLoginBtn,
            {},
            googleUser => {
                console.log("BUTTON PRESSED");
                let profile = googleUser.getBasicProfile();
                console.log(
                    "Token || " + googleUser.getAuthResponse().id_token
                );
                console.log("ID: " + profile.getId());
                console.log("Name: " + profile.getName());
                console.log("Image URL: " + profile.getImageUrl());
                console.log("Email: " + profile.getEmail());

                // send event to server to check whether the user exists in our database
                console.log("emitting check to server");
                socket.emit("user exists check", profile.getEmail());

                // i removed the signin = true portion and will do it once i get a check if the user exists
                this.setState({
                    userName: profile.getName(),
                    id: profile.getId(),
                    email: profile.getEmail(),
                    image: profile.getImageUrl()
                });
            },
            error => {
                // alert(JSON.stringify(error, undefined, 2));
                // If you close the popup, it still says that user is signedin
                console.log(this.auth2.isSignedIn.get());
                console.log("USERNAME: " + this.state.userName);
            }
        );
    };

    fbDta(res) {
        // console.log(res)
        this.setState({
            userName: res.name,
            email: res.email,
            id: res.id
        });
        socket.emit("user exists check", res.email);
    }

    ghData(res) {
        console.log(res.code);
    }

    ghFail(res) {
        console.log(res);
    }

    playSound() {
        // console.log("PLAY SOUND")
        // this.setState({
        //     clickStatus: "PLAYING"
        // })
        // wait(0.5)
        // this.setState({
        //     clickStatus: "PAUSED"
        // })
        this.soundButton.play(1.5)
    }

    render() {
        let comp;
        if (this.state.SignIn === false) {
            comp = (
                <div className="GameWindow">
                    <div className="header">
                        <div className="logo">
                            <h1>Hide.IO</h1>
                        </div>
                    </div>
                    <Break />
                    <div className="ContentScreen">
                        <div className="LoginScreen">
                            <FacebookLogin
                                appId="687955828614830"
                                autoLoad={false}
                                callback={this.fbDta}
                                fields="name,email,picture"
                                cssClass="btn btn-primary"
                                textButton="Facebook"
                                onClick={this.playSound}
                            />
                            <button
                                type="button"
                                className="btn btn-danger"
                                ref="googleLoginBtn"
                                onClick={this.playSound}
                            >
                                Google
                            </button>

                            {/* <GitHubLogin clientId="a4f49e854204af56549d"
                                redirectUri=""
                                onSuccess={this.ghData}
                                onFailure={this.ghFail}
                                className="btn btn-success"
                                buttonText="Github"
                            /> */}
                        </div>
                    </div>
                </div>
            );
        } else {
            // comp = <MenuScreen name={this.state.userName} id={this.state.id}/>
            // comp = <Lobby/>
            if (this.state.newUser) {
                comp = (
                    <UsernameSelection
                        email={this.state.email}
                        image={this.state.image}
                    />
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
        }
        return (
            <div>
                <Sound volume="60" url="https://vgmdownloads.com/soundtracks/call-of-duty-modern-warfare-2-spec-ops/zxxoexszah/08%20Bravo%20-%20Body%20Count.mp3" autoload="true" playStatus={Sound.status.PLAYING} muted="muted" loop="true" />
                {/* <Sound volume="100" url="https://www.pacdv.com/sounds/domestic_sound_effects/light-switch-1.wav" autoload="true" playFromPosition="1" playStatus={this.state.clickStatus} muted="muted" loop="true" /> */}
                {comp}
            </div>
        )
    }
}

export default LoginScreen;
