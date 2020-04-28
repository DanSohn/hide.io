/**
 * Menu Screen component.
 *
 * This page is a container for the different choices that the user may make about their pages.
 * It provides routes to:
 *      Instructions, Lobbys, Profile, Logout
 *
 */

import React, { Component } from "react";
import { Link } from 'react-router-dom';

import { auth } from "../Router";
import { googleAuth } from "../Login/LoginScreen";

import "../assets/App.css";

import Header from "../assets/Header";
import Break from "../assets/Break";
import ClickSound from "../sounds/click";
import { socket } from "../assets/socket";
import {getCookiesInfo, removeCookies} from "../assets/utils";



class MenuScreen extends Component {
    constructor(props) {
        super(props);

        const cookiesInfo = getCookiesInfo();

        this.state = {
            userName: cookiesInfo.name,
            email: cookiesInfo.email,
        };
        this.logOut = this.logOut.bind(this);
    }

    logOut(){
        console.log("Logging out in menu screen");
        socket.emit("logout");
        auth.logout(() => {
            // reason history is avail on props is b/c we loaded it via a route, which passes
            // in a prop called history always
            removeCookies();
            googleAuth.signOut();
            console.log("going to logout!");
            this.props.history.push('/');
        });
    }

    componentDidMount() {
        socket.on("reconnect_error", () => {
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
        ClickSound();
    }

    render() {

        return <div className="GameWindow">
            <Header title="Main Menu" showBack={false} />
            <Break />
            <div className="ContentScreen">
                <div className="menuScreen">

                    <Link className="playButton" to='/LobbyScreen'>
                        <span className='start-btn-green ff-20 width-350'>PLAY</span>
                    </Link>
                    <Link to='/Instructions'>
                        <span className='start-btn-green ff-20 width-350'>INSTRUCTIONS</span>
                    </Link>
                    <Link to='/Profile'>
                        <span className='start-btn-green ff-20 width-350'>PROFILE</span>
                    </Link>

                    <Link to='/Leaderboard'>
                        <span className='start-btn-green ff-20 width-350'>LEADERBOARD</span>
                    </Link>

                    <span
                        className='start-btn-green ff-20 width-350'
                        onClick={() => this.logOut()}
                    >
                        LOGOUT
                    </span>
                    
                </div>
            </div>
        </div>

    }
}

export default MenuScreen;
