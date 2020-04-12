import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {socket} from '../assets/socket';

import Header from '../assets/header';
import Break from '../assets/break';
import Room from './room';
import LobbyTables from './lobbyTables';
import ClickSound from '../sounds/click';

import '../assets/App.css';


class ViewLobbies extends Component {
    constructor(props) {
        super(props);

        // note: enter lobby is what the lobbytable child fills, when the user clicks a lobby to join. ROOMID
        this.state = {
            userName: this.props.location.state.name,
            email: this.props.location.state.email,
            image: this.props.location.state.image,
            previous: false,
            goToRoom: false,
            enter_lobby: '',
        };

        this.goPrevious = this.goPrevious.bind(this);
        this.goToJoinLobby = this.goToJoinLobby.bind(this);
    }



    goPrevious() {
        ClickSound();
        this.setState({
            previous: true,
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
        // once i emit join certain lobby and everything went alright in server, i receive event to go to room
        socket.on("joining certain lobby success", () => {
            this.setState({
                goToRoom: true,
                enter_lobby: join_code,
            });
        });

    }

    render() {
        //the idea is, for each record in the lobby database, a new div or list will appear.
        let comp;
        if (this.state.previous) {
            comp = <Redirect to={{
                pathname: '/MainMenu',
                state: {
                    name: this.state.userName,
                    email: this.state.email,
                    image: this.state.image
                }
            }}/>
        } else {
            if (this.state.goToRoom === true) {
                comp = <Redirect to={{
                    pathname: '/Room',
                    state: {
                        name: this.state.userName,
                        email: this.state.email,
                        image: this.state.image,
                        join_code: this.state.enter_lobby
                    }
                    }}/>
            } else {
                comp = (
                    <div className="GameWindow">
                        <Header previous={this.goPrevious} image={this.state.image}/>
                        <Break/>
                        <div className="ContentScreen">
                            <LobbyTables lobbyCallback={this.goToJoinLobby}/>
                            <div className="createLobby">
                                <Link to={{
                                    pathname: '/CreateLobby',
                                    state: {
                                        name: this.state.userName,
                                        email: this.state.email,
                                        image: this.state.image
                                    }
                                }}>
                                    <button
                                        type="button"
                                        className="btn btn-danger">
                                        CREATE LOBBY
                                    </button>
                                </Link>
                                <Link to={{
                                    pathname: '/JoinByCode',
                                    state: {
                                        name: this.state.userName,
                                        email: this.state.email,
                                        image: this.state.image
                                    }
                                }}>
                                    <button
                                        type="button"
                                        className="btn btn-info">
                                        JOIN BY CODE
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            }
        }
        return <>{ comp }</>;
    }
}

export default ViewLobbies;
