import { socket } from "../assets/socket";
import { gapi } from "gapi-script";

class googleAuth {
    constructor() {
        this.info = {};
        this.auth2 = null;
    }

    loginInfo() {
        return this.info;
    }

    signOut() {
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.disconnect();
        auth2.signOut()
            .then(() => {
                console.log('User succesfully signed out.');
            });
    }

    load() {
            window.gapi.load("auth2", () => {
                this.auth2 = window.gapi.auth2.init({
                    client_id:
                        "855332695584-bdpq7iidn0g11ehf2l3h5r3s61cs922m.apps.googleusercontent.com",
                    cookiepolicy: "single_host_origin",
                    scope: "profile email",
                });
                this.prepareLoginButton();
            });
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

        this.auth2.attachClickHandler(
            element,
            {},
            (googleUser) => {
                let profile = googleUser.getBasicProfile();
                /*
                ID: profile.getId()
                Name: profile.getName()
                Email: profile.getEmail()
                Image URL: profile.getImageUrl()
                 */

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