import React, { Component } from "react";
import { socket } from "../assets/socket";

class DisplayEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.userName,
      iDied: false,
      display: ""
    };
  }

  componentDidMount() {
    socket.on("display player caught", name => {
      if (this.state.userName === name) {
        this.setState({
          iDied: true,
          display: "YOU'VE BEEN CAUGHT...!"
        });
      } else {
        this.setState({
          display: name + " has been caught..."
        });
      }
    });
  }

  componentWillUnmount() {
    socket.off("display player caught");
  }

  render() {
    let comp;
    comp = (
      <>
        <h2>{this.state.display}</h2>
      </>
    );
    return (
      <div className="PlayerText">
        <div className="fade-out-3">{comp}</div>
      </div>
    );
  }
}

export default DisplayEvent;
