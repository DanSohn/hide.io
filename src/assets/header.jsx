import React, { Component } from "react";
import "./App.css";

class Header extends Component {
    render() {
        return (
            <div className="header">
                <div className="backButton">
                    <button className="btn btn-light">Go Back</button>
                </div>
                <div className="logo">
                    <h1>Hide.IO</h1>
                </div>
                <div className="profile">
                    <button className="btn btn-dark">Profile</button>
                </div>
            </div>
        );
    }
}
export default Header;
