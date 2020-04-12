// for set and get, i use https://www.w3schools.com/js/js_cookies.asp

// given parameters string type, and value, it will set the type to value with a given time limit
function set_cookies(type, val){
    // example: document.cookie = "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC";
    let date = new Date();
    // expiry time is 10 days
    let expiry = 10;
    date.setDate(date.getDate() + expiry);
    date.toUTCString();
    document.cookie = type + "=" + val + "; expires=" + date + ";";
}

// given parameter string type, it will return the value associated with it
function get_cookies(type){
    let name = type + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export {set_cookies, get_cookies};