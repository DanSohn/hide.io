import React, { Component } from "react";
import "bootstrap/dist/js/bootstrap.bundle";
import "../../assets/App.css";
import { socket } from "../../assets/socket";

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            onKeyboard: "",
            message: ""
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);
    }

    componentDidMount() {
        socket.on("message from server", info => {
            let obj = { username: info.username, message: info.message };

            this.setState({
                messages: [...this.state.messages, obj]
            });
        });
    }

    handleKeyboard(e) {
        this.setState({
            onKeyboard: e.target.value
        });
    }

    sendMessage(event) {
        event.preventDefault();
        console.log("send this message: " + this.state.onKeyboard);
        if (this.state.onKeyboard.length < 1 || this.state.onKeyboard === " ") {
            return;
        }
        socket.emit("send message", {
            room: this.props.roomID,
            username: this.props.userName,
            message: this.state.onKeyboard
        });

        let obj = { username: this.props.userName, message: this.state.onKeyboard };
        this.setState({
            message: this.state.onKeyboard,
            onKeyboard: ""
        });

        this.props.actionCallback();
    }

    render() {
        return (
            <div className=" start-btn-windows chatRoom">
                <h4 className="ff">CHAT</h4>
                <div className="chat">
                    <ul id="messages" style={{ color: "white" }}>
                        {this.state.messages.map(function (d, idx) {
                            return (
                                <li style={{ listStyleType: "none" }} key={idx}>
                                    {d.username}: {d.message}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <form onSubmit={this.sendMessage}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            aria-describedby="basic-addon2"
                            onChange={this.handleKeyboard}
                            value={this.state.onKeyboard}
                        />
                        <div className="input-group-append">
                            <button type="submit" className="btn btn-outline-secondary">
                                Submit
              </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Chat;
