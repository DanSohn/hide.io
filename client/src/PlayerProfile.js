import React, {Component} from "react"
import "./App.css"
import LoginScreen from "./loginScreen";
import {Redirect} from "react-router-dom"
import { BrowserRouter as Router } from 'react-router-dom'
import MenuScreen from "./menuScreen";

class PlayerProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: this.props.name,
            id: this.props.id,
            signedIn: true,
            goBack: false
        }
        this.goBack = this.goBack.bind(this)
    }

    goBack(){
        this.setState({
            goBack: true
        })
    }

    render() {
        let comp;
        if (!this.state.goBack) {
            comp =             
            <div className="GameWindow">
                <div className="menuScreen">
                    <h2>Name: {this.state.userName}</h2>
                    <h2>ID: {this.state.id}</h2>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={this.goBack}
                    >
                        Back
                    </button>
                </div>
            </div>
        }
        else {
            comp =
            <MenuScreen name={this.state.userName} id={this.state.id}/>
        }

        return (
            <div>{comp}</div>
        )
    }

}
export default PlayerProfile
