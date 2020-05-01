import React, { Component } from 'react';
import {socket} from "../assets/socket";
import {auth} from "../assets/auth";
import {googleAuth} from "../Login/LoginScreen";

import {removeCookies} from "../assets/utils";
import Header from "../assets/Header";
import Break from "../assets/Break";
import {Redirect} from "react-router-dom";

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

    renderTableData(){
        if (!this.state.players){
            return;
        }
        return this.state.players.map((user, index) => {
            const { username, totalWins, totalGamesPlayed, email } = user;
            let WinLossRatio = (totalGamesPlayed === 0) ? 0 : Math.round(totalWins / totalGamesPlayed * 100);
            return (
                <tr key={email} className="leaderboardTable">
                    <td>{index+1}</td>
                    <td>{username}</td>
                    <td>{WinLossRatio}</td>
                    <td>{totalWins}</td>
                    <td>{totalGamesPlayed}</td>
                </tr>
            )
        })

    }
    renderTableHeader() {
        return (
            <>
                <th className="leaderboardSmall">Rank</th>
                <th className="leaderboardSmall">Player</th>
                <th className="leaderboardSmall">Win Percentage</th>
                <th className="leaderboardSmall">Total Wins</th>
                <th className="leaderboardSmall">Total Games</th>
            </>);
    }

    componentDidMount() {
        // server will pass in all players to me
        socket.on("leaderboard res", (players) => {
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
                    <Break />
                    <div className="ContentScreen leaderboard" style={{alignItems: "flex-start"}}>
                        <table className="leaderboardTable">
                            <tbody>
                            <tr>{this.renderTableHeader()}</tr>
                            {this.renderTableData()}
                            </tbody>
                        </table>

                    </div>
                </div>
            );
        } else {
            comp = (
                <Redirect to="/MainMenu" />
            );

        }

        return <>{comp}</>;
    }
}


export default Leaderboard;