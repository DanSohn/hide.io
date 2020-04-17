import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Cookies from "universal-cookie";

import { auth } from "../Router";
import { googleAuth } from "../Login/LoginScreen";


import "../assets/App.css";

import Header from "../assets/Header";
import Break from "../assets/Break";
import ClickSound from "../sounds/click";
import { socket } from "../assets/socket";


const cookies = new Cookies();

class MenuScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            /*userName: this.props.location.state.name,
            email: this.props.location.state.email,
            */
            userName: cookies.get("name"),
            email: cookies.get("email"),
        };
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
        ClickSound();
    }

    render() {

        return <div className="GameWindow">
            <Header title="Main Menu" showBack={false}/>
            <Break/>
            <div className="ContentScreen">
                <div className="menuScreen">

                    <Link to={{
                        pathname: '/LobbyScreen',
                        /*state: {
                            name: this.state.userName,
                            email: this.state.email,
                        }*/
                    }}>
                        {/* <button
                            type="button"
                            className="z-depth-3 btn btn-success">
                            Play
                        </button> */}
                        <span className='start-btn-green ff-20 width-350'>PLAY</span>
                    </Link>
                    <Link to={{
                        pathname: '/Instructions',
                        state: {
                            /*name: this.state.userName,
                            email: this.state.email
                            */
                        }
                    }}>
                        {/* <button
                            type="button"
                            className="z-depth-3 btn btn-success">
                            Instructions
                        </button> */}
                        <span className='start-btn-green ff-20 width-350'>INSTRUCTIONS</span>
                    </Link>
                    <Link to={{
                        pathname: '/Profile',
                        state: {
                            /*name: this.state.userName,
                            email: this.state.email
                            */
                        }
                    }}>
                        {/* <button
                            type="button"
                            className="z-depth-3 btn btn-success">
                            Profile
                        </button> */}
                        <span className='start-btn-green ff-20 width-350'>PROFILE</span>
                    </Link>
                    {/* <button
                        type="button"
                        className="z-depth-3 btn btn-success"
                        onClick={() => {
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
                        }}>
                        Logout
                    </button> */}
                    <span className='start-btn-green ff-20 width-350' onClick={() => {
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
                    }}>LOGOUT</span>
                </div>
            </div>
        </div>

    }
}

export default MenuScreen;
