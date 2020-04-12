import React, {Component} from "react";
import {BrowserRouter, HashRouter, Switch, Route} from "react-router-dom";
import ProtectedRoute from "./assets/ProtectedRoute";
import {auth} from "./assets/auth";

import UsernameSelection from "./Login/usernameSelection";
import MenuScreen from "./menuScreen";
import { LoginScreen } from "./Login/loginScreen";
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
        /*

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
            <HashRouter>
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
            </HashRouter>
        );
    }
}

export {Router, auth};
