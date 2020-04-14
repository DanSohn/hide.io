import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {socket} from "../assets/socket";
import Cookies from 'universal-cookie';

import Header from "../assets/Header";
import Break from "../assets/Break";
import {auth} from "../assets/auth";
import {googleAuth} from "./LoginScreen";

const cookies = new Cookies();

class UsernameSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typing: "",
            username: "",
            //email: this.props.location.state.email,
            email: cookies.get("email"),
        };
        this.submitUsername = this.submitUsername.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);
    }

    componentDidMount() {
        socket.on("reconnect_error", (error) => {
            // console.log("Error! Disconnected from server", error);
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

    handleKeyboard(e) {
        this.setState({
            typing: e.target.value,
        });
    }

    submitUsername() {
        cookies.set("name", this.state.typing, {path: "/", maxAge: 60 * 60 * 24});

        socket.emit("create user", {
            username: this.state.typing,
            email: this.state.email,
        });

        this.setState((state) => ({
            username: this.state.typing,
        }));
    }

    render() {
        let component;
        if (this.state.username === "") {
            component = (
                <div className="z-depth-5 GameWindow">
                    <Header showBack={false} />
                    <Break />
                    <div className="ContentScreen">
                        <div className="usernameSelection">
                            <h2>Choose GamerTag</h2>
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
                                <br/>
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            );
        } else {
            component = (
                <Redirect to={{
                    pathname: '/MainMenu',
                    /*state: {
                        email: this.state.email,
                        name: this.state.username,
                    }*/
                }}/>
            );
        }
        return <>{component}</>;
    }
}

export default UsernameSelection;
