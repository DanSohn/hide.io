import React from "react";
import {HashRouter, Switch, Route } from "react-router-dom";

import ProtectedRoute from "./assets/ProtectedRoute.jsx";
import {auth} from "./assets/auth";
import {socket} from "./assets/socket";
import UsernameSelection from "./Login/UsernameSelection";
import {LoginScreen} from "./Login/LoginScreen";
import MenuScreen from "./Menu/MenuScreen";
import PlayerProfile from "./Menu/PlayerProfile";
import Instructions from "./Menu/Instructions";

import ViewLobbies from "./Lobby/ViewLobbies";
import CreateLobby from "./Lobby/CreateLobby";
import JoinCode from "./Lobby/JoinCode";
import Room from "./Lobby/Room";
import Game from "./Game/Game";


class Router extends React.Component {
    constructor(){
        super();
        this.state = ({
            networkError: false
        })
    }

    componentDidMount() {
        console.log("Router component did mount!!!!===================");
        /*
        these are placecd in router so that now the other paths will not exist if one attempts to go into them
        they will also be placed in other components such that if they are in Game for example when the
        server disconnects, it will automatically go on its own to main menu, and not linger
        */
        socket.on("reconnect", attemptNumber => {
            console.log("Eureka! Reconnected to server on try", attemptNumber);
            this.setState({
                networkError: false
            })
        });

        socket.on("reconnect_error", (error) => {
            // console.log("Error! Disconnected from server", error);
            console.log("Error! Can't connect to server :(");
            this.setState({
                networkError: true
            })
        });
    }

    componentWillUnmount() {
        console.log("UNMOUNTED ROUTER OH NOOOOO ==============");
    }

    render() {
        console.log("Rerendered!");
        if (this.state.networkError) {
            return (
                <HashRouter>
                    <div className="App">
                        <Switch>
                            <Route path="/" exact component={LoginScreen}/>

                            <ProtectedRoute path="/UsernameSelection" component={MenuScreen}/>
                            <ProtectedRoute path="/MainMenu" component={MenuScreen}/>
                            <ProtectedRoute path="/LobbyScreen" component={MenuScreen}/>
                            <ProtectedRoute path="/Profile" component={PlayerProfile}/>
                            <ProtectedRoute path="/Instructions" component={Instructions}/>
                            <ProtectedRoute path="/CreateLobby" component={MenuScreen}/>
                            <ProtectedRoute path="/JoinByCode" component={MenuScreen}/>
                            <ProtectedRoute path="/Room" component={MenuScreen}/>
                            <ProtectedRoute path="/Game" component={MenuScreen}/>

                            <Route path="*" component={() => "404 NOT FOUND"}/>
                        </Switch>
                    </div>
                </HashRouter>
            )
        } else {
            return (
                <HashRouter>
                    <div className="App">
                        <Switch>
                            <Route path="/" exact component={LoginScreen}/>

                            <ProtectedRoute path="/UsernameSelection" component={UsernameSelection}/>
                            <ProtectedRoute path="/MainMenu" component={MenuScreen}/>
                            <ProtectedRoute path="/LobbyScreen" component={ViewLobbies}/>
                            <ProtectedRoute path="/Profile" component={PlayerProfile}/>
                            <ProtectedRoute path="/Instructions" component={Instructions}/>
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
}

export {Router, auth};
