import React, { Component } from "react";

// import Player from './Player';

import OtherPlayers from "./OtherPlayers";

import '../assets/App.css';


// import { Loader } from './Loader';
// import Camera  from './Camera';
// import  Keyboard from './Keyboard';
// import Player  from './PlayerTest';
import { socket } from "../assets/socket";



var Keyboard = {};

Keyboard.LEFT = 37;
Keyboard.RIGHT = 39;
Keyboard.UP = 38;
Keyboard.DOWN = 40;

Keyboard._keys = {};

Keyboard.listenForEvents = function (keys) {
    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));

    keys.forEach(function (key) {
        this._keys[key] = false;
    }.bind(this));
}

Keyboard._onKeyDown = function (event) {
    var keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = true;
    }
};

Keyboard._onKeyUp = function (event) {
    var keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = false;
    }
};

Keyboard.isDown = function (keyCode) {
    if (!keyCode in this._keys) {
        throw new Error('Keycode ' + keyCode + ' is not being listened to');
    }
    return this._keys[keyCode];
};


function Camera(map, width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = map.cols * map.tsize - width;
    this.maxY = map.rows * map.tsize - height;
}

Camera.prototype.follow = function (sprite) {
    this.following = sprite;
    sprite.screenX = 0;
    sprite.screenY = 0;
};

Camera.prototype.update = function () {
    console.log('camera update')
    // assume followed sprite should be placed at the center of the screen
    // whenever possible
    this.following.screenX = this.width / 2;
    this.following.screenY = this.height / 2;

    // make the camera follow the sprite
    this.x = this.following.x - this.width / 2;
    this.y = this.following.y - this.height / 2;
    // clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));

    // in map corners, the sprite cannot be placed in the center of the screen
    // and we have to change its screen coordinates

    // left and right sides
    if (this.following.x < this.width / 2 ||
        this.following.x > this.maxX + this.width / 2) {
        this.following.screenX = this.following.x - this.x;
    }
    // top and bottom sides
    if (this.following.y < this.height / 2 ||
        this.following.y > this.maxY + this.height / 2) {
        this.following.screenY = this.following.y - this.y;
    }
};

function Player(map, x, y) {
    this.map = map;
    this.x = x;
    this.y = y;
    this.width = map.tsize;
    this.height = map.tsize;

    // this.image = Loader.getImage('Player');
}

Player.SPEED = 256; // pixels per second

Player.prototype.move = function (delta, dirx, diry) {
    // move 
    // if(dirx === 1){
    //     this.x = this.x + 64;
    // }else if(dirx === -1){
    //     this.x = this.x - 64;
    // }
    this.x += dirx ;
    this.y += diry ;
    console.log(dirx +' '+diry)
    // check if we walked into a non-walkable tile
    this._collide(dirx, diry);

    // clamp values
    var maxX = this.map.cols * this.map.tsize;
    var maxY = this.map.rows * this.map.tsize;
    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
};

Player.prototype._collide = function (dirx, diry) {
    var row, col;
    // -1 in right and bottom is because image ranges from 0..63
    // and not up to 64
    var left = this.x - this.width / 2;
    var right = this.x + this.width / 2 - 1;
    var top = this.y - this.height / 2;
    var bottom = this.y + this.height / 2 - 1;

    // check for collisions on sprite sides
    var collision =
        this.map.isSolidTileAtXY(left, top) ||
        this.map.isSolidTileAtXY(right, top) ||
        this.map.isSolidTileAtXY(right, bottom) ||
        this.map.isSolidTileAtXY(left, bottom);
    if (!collision) { return; }

    if (diry > 0) {
        row = this.map.getRow(bottom);
        this.y = -this.height / 2 + this.map.getY(row);
    }
    else if (diry < 0) {
        row = this.map.getRow(top);
        this.y = this.height / 2 + this.map.getY(row + 1);
    }
    else if (dirx > 0) {
        col = this.map.getCol(right);
        this.x = -this.width / 2 + this.map.getX(col);
    }
    else if (dirx < 0) {
        col = this.map.getCol(left);
        this.x = this.width / 2 + this.map.getX(col + 1);
    }
};

class Game extends Component {

    constructor(props) {
        super(props);
        document.body.style.overflow = "hidden";
    

        this.state = {
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            msg: "",
            num_of_players: this.props.numPlayers,
            players: this.props.players,
            game_status: "not started",
            images:{},
            //Game window size, it is used in the calculation of what portion of the map is viewed.
        
            // map: this.props.map,

            map: {
                cols: this.props.map.cols,
                rows: this.props.map.rows,
                tsize: this.props.map.tsize,
                tiles: this.props.map.tiles,
                getTile: function (col, row) {
                    return this.tiles[row * this.cols + col]
                },
                convert2Dto1D: (matrix) => {
                    let oneDArr = [];
                    for (let x = 0; x < matrix.length; x++) {
                        oneDArr = oneDArr.concat(matrix[x]);
                    }
                    return oneDArr;
                },
                isSolidTileAtXY: function (x, y) {
                    var col = Math.floor(x / this.tsize);
                    var row = Math.floor(y / this.tsize);
                    var tile = this.getTile(col, row);
                    if(tile ===2 || tile ===3){
                        return true;
                    }else{
                        return false;
                    }
                    // var isSolid = tile === 2 || tile === 3;
                    // return res || isSolid;
                
                },
                getCol: function (x) {
                    return Math.floor(x / this.tsize);
                },
                getRow: function (y) {
                    return Math.floor(y / this.tsize);
                },
                getX: function (col) {
                    return col * this.tsize;
                },
                getY: function (row) {
                    return row * this.tsize;
                }

            },

        };

        this.update_player_component = this.update_player_component.bind(this);
    };

    run(context) {
        this.ctx = context;
        this._previousElapsed = 0;
        // var p = [];
        // p.push(this.load('tiles', '../assets/tiles.png'));
        // p.push(this.load('Player', '../assets/character.png'));

        // var p = this.load();
        // Promise.all(p).then(function (loaded) {
        //     this.init();
        //     window.requestAnimationFrame(this.tick);
        // }.bind(this));
        this.init();
        this.tick();
    }
    tick() {
        // window.requestAnimationFrame(this.tick);

        // clear previous frame


        setInterval(() => {
            // this.update();
            this.ctx.clearRect(0, 0, 512, 512);
            var delta = .1;
            // compute delta time in seconds -- also cap it
            // var delta = (elapsed - this._previousElapsed) / 1000.0;
            delta = Math.min(delta, 0.25); // maximum delta of 250 ms
            // this._previousElapsed = elapsed;
    
            this.update(delta);
            this.gameRender();
        }, 1000 / 120);

     
    };//.bind(Game);



    init() {
        Keyboard.listenForEvents(
            [Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);
        // this.tileAtlas = Loader.getImage('tiles');
        this.Player = new Player(this.state.map, 160, 160);
        this.camera = new Camera(this.state.map, 512, 512);
        this.camera.follow(this.Player)
        console.log('init Done')

    };

    update(delta) {
        // handle Player movement with arrow keys
        let dirx = 0;
        let diry = 0;
        if (Keyboard.isDown(Keyboard.LEFT)) { dirx = -1; }
        else if (Keyboard.isDown(Keyboard.RIGHT)) { dirx = 1; }
        else if (Keyboard.isDown(Keyboard.UP)) { diry = -1; }
        else if (Keyboard.isDown(Keyboard.DOWN)) { diry = 1; }

        this.Player.move(delta, dirx, diry);
        this.camera.update();
    }

    drawLayer() {
        var startCol = Math.floor(this.camera.x / this.state.map.tsize);
        var endCol = startCol + (this.camera.width / this.state.map.tsize);
        var startRow = Math.floor(this.camera.y / this.state.map.tsize);
        var endRow = startRow + (this.camera.height / this.state.map.tsize);
        var offsetX = -this.camera.x + startCol * this.state.map.tsize;
        var offsetY = -this.camera.y + startRow * this.state.map.tsize;

        for (var c = startCol; c <= endCol; c++) {
            for (var r = startRow; r <= endRow; r++) {
                var tile = this.state.map.getTile(c, r);
                var x = (c - startCol) * this.state.map.tsize + offsetX;
                var y = (r - startRow) * this.state.map.tsize + offsetY;
                if (tile !== 0) { // 0 => empty tile

                    this.ctx.beginPath();
                    this.ctx.rect(Math.round(x),  Math.round(y), 64, 64);
                    if(tile === 1) {
                        this.ctx.fillStyle = 'white';
                    }else if(tile === 2){
                        this.ctx.fillStyle = 'green';

                    }else{
                        this.ctx.fillStyle = 'brown';
                    }
                    this.ctx.stroke();
                    this.ctx.fill();

                }
            }
        }
    }

    gameRender() {
        this.drawLayer();

        // draw main character
        this.ctx.beginPath();
        this.ctx.rect(this.Player.screenX - this.Player.width / 2, this.Player.screenY - this.Player.height / 2, 64, 64);
        this.ctx.fillStyle = 'blue';
        this.ctx.fill();
        // this.ctx.drawImage(
        //     this.Player.image,
        //     this.Player.screenX - this.Player.width / 2,
        //     this.Player.screenY - this.Player.height / 2);

        // draw map top layer
        // this._drawLayer();

        // this._drawGrid();
    };

    //movement listeners to be added on component load, only allow movement if there is no barricades

    //map update

    componentDidMount() {
        this.setState({ game_status: "in progress" });
        // this will only happen the first time, and will set the ball rolling to handle any updates!
        let context = this.refs.canvas.getContext('2d');
        this.run(context);

 
        socket.on("Redraw positions", (players) => {
            // if there has been a change to players' positions, then reset the state of players to new coordinates
            //console.log("original players ", this.state.players);
            if (this.state.players !== players) {
                this.setState({ players: players });
            }
        });
        // console.log(this.state);
    }

    // this function creates multiple player components
    update_player_component() {

        let players_arr = Object.entries(this.state.players);

        let component_insides = [];

        for (let i = 0; i < players_arr.length; i++) {
            // console.log("iterating through list");
            if (players_arr[i][0] === socket.id) {
                // if its MY player then i can handle movements and such. otherwise, its just a sprite on my screen
                //console.log("inside updating x and y are: ", players_arr[i][1].x, players_arr[i][1].y);
                component_insides.push(<Player key={players_arr[i][0]} keyVal={players_arr[i][0]} xPos={players_arr[i][1].x} yPos={players_arr[i][1].y} />);
                //console.log(component_insides[0].props);
            } else {
                component_insides.push(<OtherPlayers key={players_arr[i][0]} keyVal={players_arr[i][0]} xPos={players_arr[i][1].x} yPos={players_arr[i][1].y} />);
            }
        }

        for (let i = 0; i < players_arr.length; i++) {
            // console.log(players_arr[i][0], players_arr[i][1].x, players_arr[i][1].y);
        }

        return <div>{component_insides}</div>;

    };

    render() {
        return (
            <div>
                <canvas ref="canvas" width={512} height={512} />
            </div>
        );
    }

}

export default Game;
