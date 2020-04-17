import React, { Component } from 'react';
import { socket } from '../assets/socket';

class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: this.props.userName,
            playerRole: this.props.playerState,
            winner: ""
        }
    }

    componentDidMount() {
        socket.on("game winner", (info) => {
            this.setState({
                winner: info
            })
        })
    }

    componentWillUnmount() {
        socket.off("game winner");
    }

    render() {
        let comp;
        // If client is a seeker and he wins
        if (this.state.playerRole === "seeker" && this.state.winner === "seeker") {
            comp =
                (<div className="PlayerText">
                    <h1>Congrats, you've caught 'em all!</h1>
                    <h5>returning to lobby now...</h5>
                </div>)
        }
        // If client is a seeker and he loses
        else if (this.state.playerRole === "seeker" && this.state.winner === "hiders") {
            comp =
                (<div className="PlayerText">
                    <h1>We'll get 'em next Time</h1>
                    <h5>returning to lobby now...</h5>
                </div>)
        }
        // If client is a hider and he won
        else if (this.state.playerRole === "hider" && this.state.winner === "hiders") {
            comp =
                (<div className="PlayerText">
                    <h1>You and your fellow hiders have won!</h1>
                    <h5>returning to lobby now...</h5>
                </div>)
        }
        // If client is a hider and he lost
        else if (this.state.playerRole === "hider" && this.state.winner === "seeker") {
            comp =
                (<div className="PlayerText">
                    <h1>All of you were caught</h1>
                    <h5>returning to lobby now...</h5>
                </div>)
        } else {
            comp = (<></>)
        }
        return (<>{comp}</>);
    }
}

export default Results;