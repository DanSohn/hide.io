import React, { Component } from "react";
import "./App.css";
import LoginScreen from "../Login/loginScreen";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showBack: this.props.showBack,
            showProfile: this.props.showProfile,
            image: this.props.image,
            title: this.props.title,
            goBack: false,
            goProfile: false
        };
        this.goBack = this.goBack.bind(this);
        this.goProfile = this.goProfile.bind(this);
    }
    goBack() {
        this.setState({
            goBack: true
        });
    }
    goProfile() {
        this.setState({
            goProfile: true
        });
    }

    render() {
        let comp;
        let back;
        let profile;
        if (this.state.showBack != false) {
            back = (
                <button className="btn btn-light" onClick={this.props.previous}>
                    Go Back
                </button>
            );
        }
        if (this.state.showProfile != false) {
            profile = (
                // <button className="btn btn-dark" onClick={this.goProfile}>
                //     Profile
                // </button>
                <img src={this.state.image} alt="picture"></img>
            );
        }
        comp = (
            <React.Fragment>
                <div className="backButton">{back}</div>
                <div className="logo">
                    <h1>Hide.IO</h1>
                    <h2>{this.state.title}</h2>
                </div>
                <div className="profile">{profile}</div>
            </React.Fragment>
        );
        return <div className="header">{comp}</div>;
    }
}
export default Header;
