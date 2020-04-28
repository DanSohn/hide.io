import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { socket } from "../assets/socket";

import Header from "../assets/Header";
import Break from "../assets/Break";
import { auth } from "../assets/auth";
import { googleAuth } from "./LoginScreen";
import {addCookiesName, getCookiesInfo, removeCookies} from "../assets/utils";


class UsernameSelection extends Component {
    constructor(props) {
        super(props);
        const cookiesInfo = getCookiesInfo();
        this.state = {
            typing: "",
            username: "",
            email: cookiesInfo.email
        };
        this.submitUsername = this.submitUsername.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);
    }

    componentDidMount() {
        socket.on("reconnect_error", () => {
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

    handleKeyboard(e) {
        this.setState({
            typing: e.target.value,
        });
    }

    submitUsername() {
        addCookiesName(this.state.typing);

        socket.emit("create user", {
            username: this.state.typing,
            email: this.state.email,
        });

        this.setState({
            username: this.state.typing
        });
    }

    render() {
        let component;
        if (this.state.username === "") {
            component = (
                <div className="GameWindow">
                    <Header title="Choose Username" showBack={false} />
                    <Break />
                    <div className="ContentScreen">
                        <div className="usernameSelection">
                            <h2>Choose GamerTag</h2>
                            <form onSubmit={this.submitUsername}>
                                <input
                                    type="text"
                                    maxLength="20"
                                    className="form-control"
                                    placeholder="GamerTag"
                                    aria-label="Gamer Tag"
                                    aria-describedby="basic-addon2"
                                    onChange={this.handleKeyboard}
                                    value={this.state.typing}
                                />
                                <br />
                                <button type="submit"><span className='start-btn-blue ff-20 width-250'>SUBMIT</span></button>
                            </form>
                        </div>
                    </div>
                </div>
            );
        } else {
            component = (
                <Redirect to='/MainMenu' />
            );
        }
        return <>{component}</>;
    }
}

export default UsernameSelection;
