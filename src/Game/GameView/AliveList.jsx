import React, { Component } from "react";
<<<<<<< HEAD:src/Game/GameView/AliveList.jsx
import "../../assets/App.css";
=======
import OtherPlayers from "./OtherPlayers";
import {socket} from "../assets/socket";
import "../assets/App.css";
import Player from "./PlayerTest";
// import Keyboard from './Keyboard'
let Keyboard = {};
>>>>>>> master:src/Game/AliveList.jsx

class AliveList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aliveList: [],
            show: false,
        };

        this.tabFunction = this.tabFunction.bind(this);
        this.tabFunctionUp = this.tabFunctionUp.bind(this);
    }

    tabFunction(event) {
        if (event.keyCode === 16) {
            this.setState({
                show: true,
            });
        }
    }

    tabFunctionUp(event) {
        if (event.keyCode === 16) {
            this.setState({
                show: false,
            });
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.tabFunction);
        document.addEventListener("keyup", this.tabFunctionUp);
        socket.on("alive player list", (alivePlayers) => {
            this.setState({
                aliveList: alivePlayers
            })
        })
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.tabFunction);
        document.removeEventListener("keyup", this.tabFunctionUp);
    }

    render() {
        let comp = <></>;
        // if (this.state.show === true) {
        comp = (
            <div className="alivePlayers">
                <ul className="aliveList">
                    {this.state.aliveList.map((value,index) => {
                        return (
                            <li key={index}>
                                <img src={value}/>
                            </li>
                        );
                    })
                    }
                    </ul>
            </div>
        );
        // }

        return <>{comp}</>;
    }
}
export default AliveList;
