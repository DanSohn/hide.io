export default class Keyboard{
    LEFT = 37;
    RIGHT = 39;
    UP = 38;
    DOWN = 40;
    _keys = {};

    listenForEvents(keys){
        window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));

    keys.forEach(function (key) {
        this._keys[key] = false;
    }.bind(this));
    };

    _onKeyDown(event){
        var keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = true;
    }  
    };
    _onKeyUp(event){
        var keyCode = event.keyCode;
        if (keyCode in this._keys) {
            event.preventDefault();
            this._keys[keyCode] = false;
        }
    };
    isDown(keyCode){
        if (!keyCode in this._keys) {
            throw new Error('Keycode ' + keyCode + ' is not being listened to');
        }
        return this._keys[keyCode]; 
    };
}