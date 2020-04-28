import React, { Component } from "react";
import "../../assets/App.css";
import { socket } from "../../assets/socket";

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
                                <img src={value} alt=''/>
                            </li>
                        );
                    })}
                    </ul>
            </div>
        );

        return <>{comp}</>;
    }
}
export default AliveList;
