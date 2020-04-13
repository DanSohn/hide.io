import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import ProtectedRoute from "./assets/ProtectedRoute";
import { auth } from "./assets/auth";

import UsernameSelection from "./Login/UsernameSelection";
import MenuScreen from "./MenuScreen";
import {LoginScreen} from "./Login/LoginScreen";
import PlayerProfile from "./PlayerProfile";
import ViewLobbies from "./Lobby/ViewLobbies";
import CreateLobby from "./Lobby/CreateLobby";
import JoinCode from "./Lobby/JoinCode";
import Room from "./Lobby/Room";
import Game from "./Game/Game";


function Router() {
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

export {Router, auth};
