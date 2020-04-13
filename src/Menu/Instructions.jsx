import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import Header from "../assets/header";
import Break from "../assets/break";

import "../assets/App.css";
import ClickSound from "../sounds/click";

const cookies = new Cookies();

class Instructions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            /*userName: this.props.location.state.name,
            email: this.props.location.state.email
            */
            userName: cookies.get("name"),
            email: cookies.get("email"),
            signedIn: true,
            previous: false,
        };
        this.goPrevious = this.goPrevious.bind(this);
    }

    goPrevious() {
        ClickSound()
        this.setState({
            previous: true
        });
    }

    render() {
        let comp;
        if (!this.state.previous) {
            comp = (
                <div className="GameWindow">
                    <Header
                        previous={this.goPrevious}
                        title="Instructions"
                    />
                    <Break />
                    <div className="ContentScreen">
                        <p>Hide.IO is a real-time multi-user game in which two types of users: a Hider and a Seeker, try to find the other player or attempt to not be found.</p>
                    </div>
                </div>
            );
        } else {
            comp = <Redirect to={{
                pathname: '/MainMenu',
                /*state: {
                    name: this.state.userName,
                    email: this.state.email,
                }*/
            }} />
        }
        return <>{comp}</>
    }

}
export default Instructions;