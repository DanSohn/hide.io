import React, {Component} from "react";
import {Link} from 'react-router-dom';
import {auth} from "./Router";
import Cookies from "universal-cookie";
import { googleAuth } from "./Login/loginScreen";

import "./assets/App.css";

import Header from "./assets/header";
import Break from "./assets/break";
import ClickSound from "./sounds/click";

const cookies = new Cookies();

class MenuScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            /*userName: this.props.location.state.name,
            email: this.props.location.state.email,
            */
            userName: cookies.get("name"),
            email: cookies.get("email"),
        };
    }


    render() {
        return <div className="GameWindow">
            <Header showBack={false}/>
            <Break/>
            <div className="ContentScreen">
                <div className="menuScreen">
                    <Link to={{
                        pathname: '/LobbyScreen',
                        /*state: {
                            name: this.state.userName,
                            email: this.state.email,
                        }*/
                    }}>
                        <button
                            type="button"
                            className="btn btn-success">
                            Play
                        </button>
                    </Link>
                    <Link to={{
                        pathname: '/Instructions',
                        state: {
                            /*name: this.state.userName,
                            email: this.state.email
                            */
                        }
                    }}>
                        <button
                            type="button"
                            className="btn btn-success">
                            Instructions
                        </button>
                    </Link>
                    <Link to={{
                        pathname: '/Profile',
                        state: {
                            /*name: this.state.userName,
                            email: this.state.email
                            */
                        }
                    }}>
                        <button
                            type="button"
                            className="btn btn-success">
                            Profile
                        </button>
                    </Link>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
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
                        }}>
                        Logout
                    </button>
                </div>
            </div>
        </div>

    }
}

export default MenuScreen;
