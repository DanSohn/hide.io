import React, { Component } from 'react';
import Header from '../assets/header';
import Break from '../assets/break';
import MenuScreen from '../menuScreen';
import CreateLobby from './createLobby';
import Room from './room';
import LobbyTables from './lobbyTables';

import '../assets/App.css';
import { socket } from '../assets/socket';
import ClickSound from '../sounds/click';
import JoinCode from './joinCode';

class ViewLobbies extends Component {
    constructor(props) {
        super(props);

        console.log(
            'In lobby selection screen, received the props: ',
            this.props.name,
            this.props.email
        );
        // note: enter lobby is what the lobbytable child fills, when the user clicks a lobby to join. ROOMID
        this.state = {
            userName: this.props.name,
            email: this.props.email,
            previous: false,
            image: this.props.image,
            stage: 0,
            enter_lobby: '',
        };

        this.createLobby = this.createLobby.bind(this);
        this.goPrevious = this.goPrevious.bind(this);
        this.goToCreateLobby = this.goToCreateLobby.bind(this);
        this.goToJoinLobby = this.goToJoinLobby.bind(this);
        this.goToJoinCode = this.goToJoinCode.bind(this);
    }

    createLobby() {
        ClickSound();
        socket.emit('create lobby', {
            userName: this.state.userName,
            email: this.state.email,
            settings: 'no settings rn',
        });
    }
    goPrevious() {
        ClickSound();
        this.setState({
            previous: true,
        });
    }

    goToCreateLobby() {
        ClickSound();
        this.setState({
            stage: 1,
        });
    }

    goToJoinCode() {
        ClickSound();
        this.setState({
            stage: 2,
        });
    }

    // callback function from the lobby table that will return the lobby_code that we can join.
    goToJoinLobby(join_code) {
        ClickSound();
        console.log('received join_code from table', join_code);
        // after i join, i send an event to update everyone in the viewlobbies screen. They will see the new amt of players
        // per room
        socket.emit('please give lobbies');

        socket.emit('join certain lobby', {
            room: join_code,
            email: this.state.email,
            username: this.state.userName,
        });

        this.setState({
            stage: 3,
            enter_lobby: join_code,
        });
    }

    render() {
        //the idea is, for each record in the lobby database, a new div or list will appear.
        let comp;
        if (this.state.previous) {
            comp = (
                <MenuScreen
                    email={this.state.email}
                    name={this.state.userName}
                    image={this.state.image}
                />
            );
        } else if (this.state.stage === 1) {
            comp = (
                <CreateLobby
                    name={this.state.userName}
                    email={this.state.email}
                    image={this.state.image}
                />
            );
        } else if (this.state.stage === 2) {
            comp = (
                <JoinCode
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
        } else if (this.state.stage === 0) {
            comp = (
                <div className="GameWindow">
                    <Header previous={this.goPrevious} image={this.props.image} />
                    <Break />
                    <div className="ContentScreen">
                        <LobbyTables lobbyCallback={this.goToJoinLobby} />
                        <div className="createLobby">
                            {/* <button
                                type="button"
                                className="btn btn-success"
                                onClick={this.createLobby}
                            /> */}
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={this.goToCreateLobby}>
                                CREATE LOBBY
                            </button>
                            <button
                                type="button"
                                className="btn btn-info"
                                onClick={this.goToJoinCode}>
                                JOIN BY CODE
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return <React.Fragment>{comp}</React.Fragment>;
    }
}
export default ViewLobbies;
