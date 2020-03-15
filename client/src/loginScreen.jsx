import React, { Component } from "react";

// import {socket} from './socket'
// import Game from "./Game";
import "./App.css";
import Lobby from "./Lobby/Lobby";
import UsernameSelection from "./usernameSelection";
class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SignIn: false,
            userName: "",
            id: ""
        }
        this.goToLobby = this.goToLobby.bind(this);
    }

    componentDidMount() {
        this.googleSDK();
    }

    goToLobby() {
        this.setState(state =>({
            SignIn: true
        }));
    }

    googleSDK() {
 
        window['googleSDKLoaded'] = () => {
          window['gapi'].load('auth2', () => {
            this.auth2 = window['gapi'].auth2.init({
              client_id: '855332695584-bdpq7iidn0g11ehf2l3h5r3s61cs922m.apps.googleusercontent.com',
              cookiepolicy: 'single_host_origin',
              scope: 'profile email'
            });
            this.prepareLoginButton();
          });
        }
       
        (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'google-jssdk'));
       
      }

      prepareLoginButton = () => {
        console.log(this.refs.googleLoginBtn);
        
        this.auth2.attachClickHandler(this.refs.googleLoginBtn, {},
            (googleUser) => {
            console.log("BUTTON PRESSED")
            let profile = googleUser.getBasicProfile();
            console.log('Token || ' + googleUser.getAuthResponse().id_token);
            console.log('ID: ' + profile.getId());
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail());
            
            this.setState({
                userName: profile.getName(),
                SignIn: true
            })
         
            },(error) => {
                // alert(JSON.stringify(error, undefined, 2));
                // If you close the popup, it still says that user is signedin
                console.log(this.auth2.isSignedIn.get())
            })
        } 

    render() {
        let comp;
        if (this.state.SignIn === false) {
            comp = <div className = "GameWindow">
            <div className="LoginScreen">
                <h1>Hide.IO</h1>
                <button type= "button" className = "btn btn-primary" onClick={this.goToLobby}>Facebook</button>
                <button type= "button" className = "btn btn-danger" ref="googleLoginBtn">Google</button>
                <button type= "button" className = "btn btn-success" onClick = {this.goToLobby}>Github</button>
            </div>
        </div>
        }
        else {
            comp = <Lobby/>
        }
        return <div>{comp}</div>;
    }
}
export default LoginScreen;
