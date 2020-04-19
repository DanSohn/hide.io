export default class Keyboard {

    constructor() {
        this.LEFT = 37;
        this.RIGHT = 39;
        this.UP = 38;
        this.DOWN = 40;
        this._keys = {};

        this.listenForEvents = this.listenForEvents.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this.isDown = this.isDown.bind(this);
    }

    listenForEvents(keys) {
        window.addEventListener('keydown', this._onKeyDown.bind(this));
        window.addEventListener('keyup', this._onKeyUp.bind(this));

        keys.forEach(
            function (key) {
                this._keys[key] = false;
            }.bind(this));
    }

    _onKeyDown(event) {
            var keyCode = event.keyCode;
            if (keyCode in this._keys) {
                event.preventDefault();
                this._keys[keyCode] = true;
            }
    }

    _onKeyUp(event)  {
        var keyCode = event.keyCode;
        if (keyCode in this._keys) {
            event.preventDefault();
            this._keys[keyCode] = false;
        }
    }

    isDown(keyCode) {
        if (!keyCode in this._keys) {
            throw new Error('Keycode ' + keyCode + ' is not being listened to');
        }
        return this._keys[keyCode];
    }
}