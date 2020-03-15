import React, {Component} from 'react';

import {socket} from './socket'
import Game from "./Game";
import './App.css';
import Lobby from './Lobby/Lobby';
class mainScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SignIn: false
        }
        this.goToLobby = this.goToLobby.bind(this);
    }
    goToLobby() {
        this.setState(state =>({
            SignIn: true
         }));
    }

    render() {
        let comp
        if (this.state.SignIn === false) {
            comp = <div className = "GameWindow">
            <div className="LoginScreen">
                <h1>Hide.IO</h1>
                <button type= "button" className = "btn btn-primary" onClick={this.goToLobby}>Facebook</button>
                <button type= "button" className = "btn btn-danger" onClick = {this.goToLobby}>Ali &hearts; </button>
                <button type= "button" className = "btn btn-success" onClick = {this.goToLobby}>Github</button>
                <h2>Authentication Goes here.</h2>
            </div>
        </div>
        }
        else {
            comp = <Lobby/>
        }
        return (
            <div>
               {comp}
            </div>
        );
    }
}
export default mainScreen;