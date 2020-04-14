import React, {Component} from 'react';
import {socket} from '../assets/socket';

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
                (<>
                    <p>Congrats {this.state.userName}...you've caught them all!</p>
                    <p>returning to lobby now...</p>
                </>)
        }
        // If client is a seeker and he loses
        else if (this.state.playerRole === "seeker" && this.state.winner === "hider") {
            comp =
                (<>
                    <p>Hey {this.state.userName}...you are a let down!</p>
                    <p>returning to lobby now...</p>
                </>)
        }
        // If client is a hider and he won
        else if (this.state.playerRole === "hider" && this.state.winner === "hider") {
            comp =
                (<>
                    <p>Okay I guess you're slick...hiders win!</p>
                    <p>returning to lobby now...</p>
                </>)
        }
        // If client is a hider and he lost
        else if (this.state.playerRole === "hider" && this.state.winner === "seeker") {
            comp =
                (<>
                    <p>All hiders have been caught...buncha losers ¯\_(ツ)_/¯</p>
                    <p>returning to lobby now...</p>
                </>)
        } else {
            comp = (<></>)
        }
        return <>{comp}</>
    }
}

export default Results;