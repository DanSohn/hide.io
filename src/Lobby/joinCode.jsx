import React, { Component } from 'react';
import Header from '../assets/header';
import Break from '../assets/break';
import { socket } from '../assets/socket';

import 'bootstrap/dist/js/bootstrap.bundle';
import '../assets/App.css';
import { returnGameMode, returnGameMap, returnGameTime } from '../assets/utils';
import ViewLobbies from './viewLobbies';
import Game from '../Game/Game';
import ClickSound from '../sounds/click';
import TimerSound from '../sounds/timer';
import LobbyTables from './lobbyTables';
import Room from './room';

class JoinCode extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: this.props.name,
            email: this.props.email,
            previous: false,
            image: this.props.image,
            typing: '',
            stage: 0,
            enter_lobby: '',
        };

        this.goPrevious = this.goPrevious.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);
        //this.GoToJoinCode = this.GoToJoinCode.bind(this);
        this.goToJoinLobby = this.goToJoinLobby.bind(this);
    }

    goPrevious() {
        console.log('hello');
        ClickSound();
        this.setState({
            previous: true,
        });
    }

    handleKeyboard(e) {
        console.log(e.target.value);
        this.setState({
            typing: e.target.value,
        });
    }

    goToJoinLobby(join_code) {
        ClickSound();
        console.log('received join_code from table', join_code);
        // after i join, i send an event to update everyone in the viewlobbies screen. They will see the new amt of players
        // per room
        socket.emit('please give lobbies');

        socket.emit('join certain lobby', {
            code: join_code,
            email: this.state.email,
            username: this.state.userName,
        });

        this.setState({
            stage: 3,
            enter_lobby: 'ii8q41',
        });
    }

    render() {
        let comp;
        if (this.state.previous) {
            comp = (
                <ViewLobbies
                    name={this.state.userName}
                    email={this.state.email}
                    image={this.state.image}
                />
            );
        } else if (this.state.stage === 3) {
            comp = (
                <Room
                    name={this.state.userName}
                    email={this.state.email}
                    image={this.state.image}
                    join_code={this.state.enter_lobby}
                />
            );
        } else {
            comp = (
                <div className="GameWindow">
                    <Header previous={this.goPrevious} image={this.state.image} />
                    <Break />
                    <div className="ContentScreen"></div>
                    <div className="ContentScreen">
                        <div className="usernameSelection">
                            <h2>Enter a Join Code:</h2>
                            <form onSubmit={this.submitUsername}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="GamerTag"
                                    aria-label="Gamer Tag"
                                    aria-describedby="basic-addon2"
                                    onChange={this.handleKeyboard}
                                    value={this.state.typing}
                                />
                                <br />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={this.goToJoinLobby}>
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
        return <div>{comp}</div>;
    }
}
export default JoinCode;
