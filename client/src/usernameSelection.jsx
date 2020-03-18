import React, { Component } from "react";
import MenuScreen from "./menuScreen";
import { socket } from "./socket";
import Header from "./header";
import Break from "./break";

class UsernameSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typing: "",
            username: "",
            email: this.props.email
        };
        this.submitUsername = this.submitUsername.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);
    }

    handleKeyboard(e) {
        console.log(e.target.value);
        this.setState({
            typing: e.target.value
        });
    }

    submitUsername() {
        console.log("full name: ", this.state.typing);
        // i do the socket events before i set the state as I'm not sure if setting it will automatically go to rendering
        // before i continue this function
        socket.emit("create user", {
            username: this.state.typing,
            email: this.state.email
        });

        this.setState(state => ({
            username: this.state.typing
        }));
    }

    render() {
        let comp;
        if (this.state.username === "") {
            comp = (
                <div className="GameWindow">
                    <Header />
                    <Break />
                    <div className="ContentScreen">
                        <div className="usernameSelection">
                            <h2>Choose GamerTag</h2>
                            <form onSubmit={this.submitUsername}>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="GamerTag"
                                    aria-label="Gamer Tag"
                                    aria-describedby="basic-addon2"
                                    onChange={this.handleKeyboard}
                                    value={this.state.typing}
                                />
                                <button
                                    class="btn btn-outline-secondary"
                                    type="button"
                                    onClick={this.submitUsername}
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            );
        } else {
            comp = (
                <MenuScreen
                    email={this.state.email}
                    name={this.state.username}
                />
            );
        }
        return <div>{comp}</div>;
    }
}

export default UsernameSelection;
