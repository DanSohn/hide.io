import React, {Component} from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import ProtectedRoute from "./assets/ProtectedRoute";
import {auth} from "./assets/auth";
import {get_cookies, set_cookies} from "./assets/cookies";
import {socket} from "./assets/socket";

import UsernameSelection from "./Login/usernameSelection";
import MenuScreen from "./menuScreen";
import LoginScreen from "./Login/loginScreen";
import PlayerProfile from "./PlayerProfile";
import ViewLobbies from "./Lobby/viewLobbies";
import CreateLobby from "./Lobby/createLobby";
import JoinCode from "./Lobby/joinCode";
import Room from "./Lobby/room";
import Game from "./Game/Game";


class Router extends Component {
    // might need to import props at another time?
    constructor(props) {
        //console.log("Router constructor");
        super(props);

    }

    componentDidMount() {
        // if cookies show authentication, then set auth to be true
        /*let cookies_email = get_cookies("email");
        let cookies_uname = get_cookies("name");
        let cookies_img = get_cookies("profilePic");
        if (cookies_email) {
            socket.emit("user exists check", cookies_email);
        }

        socket.on("user database check", (username) => {
            if (cookies_email && cookies_uname && cookies_img) {
                if (username && username === cookies_uname) {
                    auth.login();
                }
            }else{
                console.log("either don't have email or username or image stored");
                alert("Theres been a change to your account, please log in");
            }
        });*/
    }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Switch>
                        <Route path="/" exact component={LoginScreen}/>

                        <ProtectedRoute path="/UsernameSelection" component={UsernameSelection}/>
                        <ProtectedRoute path="/MainMenu" component={MenuScreen}/>
                        <ProtectedRoute path="/LobbyScreen" component={ViewLobbies}/>
                        <ProtectedRoute path="/Profile" component={PlayerProfile}/>
                        <ProtectedRoute path="/CreateLobby" component={CreateLobby}/>
                        <ProtectedRoute path="/JoinByCode" component={JoinCode}/>
                        <ProtectedRoute path="/Room" component={Room}/>
                        <ProtectedRoute path="/Game" component={Game}/>

                        <Route path="*" component={() => "404 NOT FOUND"}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export {Router, auth};
