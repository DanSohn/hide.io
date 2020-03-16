import React, { Component } from "react";
import MenuScreen from "./menuScreen";

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
        console.log(e.target.value)
        this.setState({
            typing: e.target.value
        })
    }

    submitUsername() {
        this.setState(state => ({
            username: this.state.typing
        }));
    }

    render() {
        let comp;
        if (this.state.username === "") {
            comp = (
                <div className="GameWindow">
                    <div className="usernameSelection">
                        <h1>Hide.IO</h1>
                        <h2>Choose GamerTag</h2>
                        <form onSubmit={this.submitUsername}>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Ali Alkhazaly"
                                onChange={this.handleKeyboard}
                                value={this.state.typing}
                            />
                            <br></br>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={this.submitUsername}
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            );
        } else {
            comp = <MenuScreen email={this.state.email} name={this.state.username}/>;
        }
        return <div>{comp}</div>;
    }
}
export default UsernameSelection;
