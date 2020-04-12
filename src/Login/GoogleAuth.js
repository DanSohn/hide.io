import {socket} from "../assets/socket";

class googleAuth {
    constructor() {
        this.info = {};
    }

    loginInfo(){
        return this.info;
    }

    /*signOut(){
        console.log("In googleAuth signing out");

        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
    }*/

    load(){
        console.log("In googleAuth load");
        window["googleSDKLoaded"] = () => {
            window["gapi"].load("auth2", () => {
                this.auth2 = window["gapi"].auth2.init({
                    client_id:
                        "855332695584-bdpq7iidn0g11ehf2l3h5r3s61cs922m.apps.googleusercontent.com",
                    cookiepolicy: "single_host_origin",
                    scope: "profile email",
                });
                console.log("prepping login");
                this.prepareLoginButton();
            });
        };
        (function (d, s, id) {
            let js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, "script", "google-jssdk");
    }

    prepareLoginButton = () => {
        let element = document.getElementById("googleLogin");
        // console.log("here!", element);

        this.auth2.attachClickHandler(
            element,
            {},
            (googleUser) => {
                // console.log("BUTTON PRESSED");
                let profile = googleUser.getBasicProfile();
                // console.log("Token || " + googleUser.getAuthResponse().id_token);
                // console.log("ID: " + profile.getId());
                // console.log("Name: " + profile.getName());
                // console.log("Image URL: " + profile.getImageUrl());
                // console.log("Email: " + profile.getEmail());

                // send event to server to check whether the user exists in our database
                // console.log("emitting check to server");
                socket.emit("user exists check", profile.getEmail());

                this.info = {
                    userName: profile.getName(),
                    id: profile.getId(),
                    email: profile.getEmail(),
                    image: profile.getImageUrl()
                };

            },
            () => {
                // alert(JSON.stringify(error, undefined, 2));
                // If you close the popup, it still says that user is signedin
                console.log(this.auth2.isSignedIn.get());
            }
        );
    };

}

export default new googleAuth();