import React, {Component} from "react";
import { Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import Header from "./assets/Header";
import Break from "./assets/Break";

import "./assets/App.css";
import ClickSound from "./sounds/click";

const cookies = new Cookies();

class PlayerProfile extends Component {
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
                        title="Profile"
                    />
                    <Break/>
                    <div className="ContentScreen">
                        <div className="profileLabels">
                            <h2>Name:</h2>
                            <h2>Email:</h2>
                            <h2>Win/Loss:</h2>
                            <h2>Total Games:</h2>
                        </div>
                        <div className="profileResults">

                            <input
                                type="text"
                                className="form-control"
                                id="userName"
                                placeholder={this.state.userName}
                                readOnly
                            />
                            <input
                                type="text"
                                id="email"
                                className="form-control"
                                placeholder={this.state.email}
                                readOnly
                            />
                            <input
                                type="text"
                                id="kdr"
                                className="form-control"
                                placeholder="200/0"
                                readOnly
                            />
                            <input
                                type="text"
                                id="totalgames"
                                className="form-control"
                                placeholder="I assume wins + loss"
                                readOnly
                            />
                        </div>
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
            }}/>
        }

        return <>{comp}</>;
    }
}

export default PlayerProfile;
