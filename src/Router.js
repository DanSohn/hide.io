import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";

import ProtectedRoute from "./assets/ProtectedRoute.jsx";
import { auth } from "./assets/auth";
import { socket } from "./assets/socket";
import UsernameSelection from "./Login/UsernameSelection";
import { LoginScreen } from "./Login/LoginScreen";
import MenuScreen from "./Menu/MenuScreen";
import PlayerProfile from "./Menu/PlayerProfile";
import Instructions from "./Menu/Instructions";

import ViewLobbies from "./Lobby/ViewLobbies";
import CreateLobby from "./Lobby/CreateLobby";
import JoinCode from "./Lobby/JoinCode";
import Room from "./Lobby/Room";
import Game from "./Game/Game";
import Sound from "react-sound";
import getSong from "./sounds/randomMusic";

class Router extends React.Component {
  constructor() {
    super();
    this.state = {
      songURL: "./sounds/uncharted.mp3",
      gameSoundURL:
        "https://freesound.org/data/previews/34/34338_215874-lq.mp3",
      networkError: false,
      soundState: Sound.status.STOPPED,
      gameSoundState: Sound.status.STOPPED,
      purposefulStop: false
    };
    this.waitForClicks = this.waitForClicks.bind(this);
    this.soundButton = new Audio(getSong());
    this.soundButton.play();
  }

  waitForClicks() {
    if (!this.state.purposefulStop)
      setTimeout(() => {
        this.setState({ soundState: Sound.status.PLAYING });
        this.soundButton.play();
      }, 5000);
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
      });
    });

    socket.on("reconnect_error", error => {
      // console.log("Error! Disconnected from server", error);
      console.log("Error! Can't connect to server :(");
      this.setState({
        networkError: true
      });
    });

    socket.on("lobby current timer", countdown => {
      if (countdown <= 0) {
        this.soundButton.pause();
        this.soundButton.currentTime = 0;
        this.setState({
          soundState: Sound.status.STOPPED,
          gameSoundState: Sound.status.PLAYING,
          purposefulStop: true
        });
      }
    });

    socket.on("game finished", () => {
      this.soundButton.play();
      this.setState({
        soundState: Sound.status.PLAYING,
        gameSoundState: Sound.status.STOPPED
      });
    });
  }

  componentWillUnmount() {
    console.log("UNMOUNTED ROUTER OH NOOOOO ==============");
    socket.off("game finished");
    socket.off("lobby current timer");
    socket.off("reconnect_error");
    this.soundButton.pause();
    this.soundButton.currentTime = 0;
  }

  render() {
    return (
      <HashRouter>
        <>
          <Switch>
            <Route path="/" exact component={LoginScreen} />

            <ProtectedRoute
              path="/UsernameSelection"
              component={UsernameSelection}
            />
            <ProtectedRoute path="/MainMenu" component={MenuScreen} />
            <ProtectedRoute path="/LobbyScreen" component={ViewLobbies} />
            <ProtectedRoute path="/Profile" component={PlayerProfile} />
            <ProtectedRoute path="/Instructions" component={Instructions} />
            <ProtectedRoute path="/CreateLobby" component={CreateLobby} />
            <ProtectedRoute path="/JoinByCode" component={JoinCode} />
            <ProtectedRoute path="/Room" component={Room} />
            <ProtectedRoute path="/Game" component={Game} />

            <Route path="*" component={() => "404 NOT FOUND"} />
          </Switch>
          <Sound
            volume={55}
            url={this.state.gameSoundURL}
            autoload={true}
            playStatus={this.state.gameSoundState}
            muted={"muted"}
            loop={true}
          />
        </>
      </HashRouter>
    );
  }
}

export { Router, auth };
