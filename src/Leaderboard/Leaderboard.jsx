import React, {Component} from 'react';
import {socket} from "../assets/socket";
import {auth} from "../assets/auth";
import {googleAuth} from "../Login/LoginScreen";

import {removeCookies} from "../assets/utils";
import Header from "../assets/Header";
import Break from "../assets/Break";
import {Redirect} from "react-router-dom";
import UsersTable from "./UsersTable";
import ClickSound from "../sounds/click";
import "../assets/App.css";


class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previous: false,
            players: []
        }
        this.goPrevious = this.goPrevious.bind(this);

        socket.emit("leaderboard req");
    }

    componentDidMount() {
        // server will pass in all players to me
        socket.on("leaderboard res", (players) => {
            // add entry into each player object their win loss ratio
            for (let i = 0; i < players.length; i++) {
                players[i].winLossRatio = (players[i].totalGamesPlayed === 0) ? 0 : Math.round(players[i].totalWins / players[i].totalGamesPlayed * 100);
            }

            console.log("received player list", players);

            this.setState({
                players: players
            });
        });

        socket.on("reconnect_error", (error) => {
            // console.log("Error! Disconnected from server", error);
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
    }

    goPrevious() {
        ClickSound();
        this.setState({
            previous: true
        });
    }

    render() {
        let comp;
        if (!this.state.previous) {
            comp = (
                <div className="GameWindow">
                    <Header
                        previous={this.goPrevious}
                        title="Profile"
                    />
                    <Break/>
                    <div className="ContentScreen leaderboard" style={{alignItems: "flex-start"}}>
                        <UsersTable users={this.state.players}/>
                    </div>
                </div>
            );
        } else {
            comp = (
                <Redirect to="/MainMenu"/>
            );

        }

        return <>{comp}</>;
    }
}


export default Leaderboard;