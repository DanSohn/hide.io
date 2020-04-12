import React, {Component} from "react";
import {Link} from 'react-router-dom';
import "./assets/App.css";
import {auth} from "./Router";
import { googleAuth } from "./Login/loginScreen";
import Header from "./assets/header";
import Break from "./assets/break";
import ClickSound from "./sounds/click";

class MenuScreen extends Component {
    constructor(props) {
        super(props);
        console.log("In menu screen, received the props: ", this.props.location.state.name, this.props.location.state.email);
        this.state = {
            userName: this.props.location.state.name,
            email: this.props.location.state.email,
            image: this.props.location.state.image,
        };
    }


    render() {
        return <div className="GameWindow">
            <Header showBack={false} image={this.state.image}/>
            <Break/>
            <div className="ContentScreen">
                <div className="menuScreen">
                    <Link to={{
                        pathname: '/LobbyScreen',
                        state: {
                            name: this.state.userName,
                            email: this.state.email,
                            image: this.state.image
                        }
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
                            name: this.state.userName,
                            email: this.state.email,
                            image: this.state.image
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
                            name: this.state.userName,
                            email: this.state.email,
                            image: this.state.image
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
