import React, { Component } from "react";
import { socket } from "../assets/socket";

class ProfileResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            email: this.props.email,
            tWins: 0,
            tGames: 0,
            tLosses: 0,
        }

        // request for the player's stats
        socket.emit("player stats req", this.state.email);

    }

    componentDidMount() {
        // wait for player's stats
        socket.on("player stats res", (player) => {
            console.log("Received players information in Profile");
            // if player exists and at least one of the two info (wins or games) are different, i update state
            if (player) {
                this.setState({
                    tWins: player.totalWins,
                    tGames: player.totalGamesPlayed,
                    tLosses: player.totalGamesPlayed - player.totalWins,
                })

            }
        });
    }

    componentWillUnmount() {
        socket.off("player stats res");

    }


    render() {
        let ratio = this.state.tWins.toString() + " / " + this.state.tLosses.toString();
        return (
            <div className="profileData">
                <div className="profilePair">
                    <span className="ff-20">Name:</span>
                    <input
                        type="text"
                        className="form-control"
                        id="userName"
                        placeholder={this.state.name}
                        readOnly
                    />
                </div>
                <div className="profilePair">
                    <span className="ff-20">Email:</span>
                    <input
                        type="text"
                        id="email"
                        className="form-control"
                        placeholder={this.state.email}
                        readOnly
                    />
                </div>
                <div className="profilePair">
                    <span className="ff-20">Win/Loss:</span>
                    <input
                        type="text"
                        id="kdr"
                        className="form-control"
                        placeholder={ratio}
                        readOnly
                    />
                </div>
                <div className="profilePair">
                    <span className="ff-20">Total Games:</span>
                    <input
                        type="text"
                        id="totalgames"
                        className="form-control"
                        placeholder={this.state.tGames}
                        readOnly
                    />
                </div>
            </div>
        )
    }

}

export default ProfileResults;