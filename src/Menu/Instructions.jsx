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
                <div className="z-depth-5 GameWindow">
                    <Header
                        previous={this.goPrevious}
                        title="Instructions"
                    />
                    <Break />
                    <div className="ContentScreen">
                        <div className="instructions">
                            <h1>Gameplay:</h1>
                            <p>Hide.IO is a real-time multi-user game in which two types of users: a Hider and a Seeker, try to
                            find the other player or attempt to not be found. The game starts by randomly selecting one of the
                            players in the lobby to be the seeker, while the rest are hiders. At the start of each game, There
                            is a 15 second period where the hiders get to scout out a place to hide. During this period, the
                            seeker is unable to move or see anything on their screen, thus preventing the likelihood of knowing
                            where the hiders are. Once 15-second period is over, the seeker will then be able to see the map and
                        begin their search for the hiders.</p>
                            <h1>Type of Players:</h1>
                            <h2>Seeker</h2>
                            <p>One of the main users within the game is the Seeker. There is only a single seeker in each game
                            and the main objective of the seeker is to locate all the hiders before the time limit passes. The
                            seeker has a 360 degree flashlight that aids in locating the hiders. Also, the seeker has faster
                        movement than the hiders, thus making it easier to chase after the other players.</p>
                            <h2>Hider</h2>
                            <p>The other main user within the game is the Hiders. Everyone except for one user will be hiders and
                            their main objective is to avoid getting caught by the seeker until the time runs out. The hiders have
                            a small 360 degree flashlight as well, to allow them to see a small distance in front of them. Movement
                            of the hiders is slower than the seeker, so it is important to avoid being located, or else the chance of
                        getting caught is almost gauranteed!</p>

                            <h1>Win/Loss Condition:</h1>
                            <h2>Seeker</h2>
                            <p>The win condition for the seeker is to find and catch all the hiders in the game, before the time runs out.
                            The loss condition for the seeker is when the time runs out and they were unsuccessful in finding all the hiders.
                            </p>
                            <h2>Hiders</h2>
                            <p>The win condition for the hiders is to have at least a single hider stay alive before the time runs out.
                            The loss condition for the hiders is when all the hiders have been caught by the seeker and there is still time
                            left on the clock.</p>
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
            }} />
        }
        return <>{comp}</>
    }

}
export default Instructions;