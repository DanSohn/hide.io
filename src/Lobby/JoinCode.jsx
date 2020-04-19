import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { socket } from '../assets/socket';
import Cookies from "universal-cookie";

import Header from '../assets/Header';
import Break from '../assets/Break';

import 'bootstrap/dist/js/bootstrap.bundle';
import '../assets/App.css';
import ClickSound from '../sounds/click';
import { auth } from "../assets/auth";
import { googleAuth } from "../Login/LoginScreen";

const cookies = new Cookies();

class JoinCode extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: cookies.get("name"),
            email: cookies.get("email"),
            previous: false,
            roomID: '',
            enter_room: false,
            errorMsg: "",
        };

        this.goPrevious = this.goPrevious.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        socket.on("reconnect_error", (error) => {
            console.log("Error! Can't connect to server");
            auth.logout(() => {
                // reason history is avail on props is b/c we loaded it via a route, which passes
                // in a prop called history always
                cookies.remove("name");
                cookies.remove("email");
                cookies.remove("image");
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
        console.log('hello');
        ClickSound();
        this.setState({
            previous: true,
        });
    }

    handleKeyboard(e) {
        console.log(e.target.value);
        this.setState({
            roomID: e.target.value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        ClickSound();
        socket.emit("validate join code req", { room: this.state.roomID, email: this.state.email, username: this.state.userName });

        socket.on("validate join code res", lobbyStatus => {
            if (lobbyStatus === 0) {
                // error message saying not a valid room
                this.setState({
                    errorMsg: "Incorrect join code. Please try again."
                })

            } else if(lobbyStatus === 1){
                this.setState({
                    enter_room: true,
                });
            } else {
                this.setState({
                    errorMsg: "The lobby you are trying to join is currently in game. Please try later, or join another lobby."
                })
            }
        });
    }


    render() {
        let comp;
        if (this.state.previous) {
            comp = <Redirect to={{
                pathname: '/LobbyScreen',
            }} />

        } else if (this.state.enter_room === true) {
            comp = <Redirect to={{
                pathname: '/Room',
                state: {
                    join_code: this.state.roomID
                }
            }} />
        } else {
            comp = (
                <div className="GameWindow">
                    <Header title="Join Lobby" previous={this.goPrevious}/>
                    <Break />
                    <div className="ContentScreen">
                        <div className="usernameSelection">
                            <p className="errorMsg">{this.state.errorMsg}</p>
                            <h2>Enter a Join Code:</h2>
                            <form onSubmit={this.handleSubmit}>
                                <input
                                    type="text"
                                    className="form-control"
                                    aria-describedby="basic-addon2"
                                    onChange={this.handleKeyboard}
                                    value={this.state.roomID}
                                    required
                                />
                                <br />
                                <button type="submit"><span className='start-btn-blue ff-20 width-250'>SUBMIT</span></button>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
        return <>{comp}</>;
    }
}
export default JoinCode;
