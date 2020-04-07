import React, { Component } from "react";

// import Player from './Player';

import OtherPlayers from "./OtherPlayers";

import '../assets/App.css';

import Wall from './Wall';
import Camera from './Camera';
// import  Keyboard from './Keyboard';
import Player from './PlayerTest';
import { socket } from "../assets/socket";
import Point from './Point';

let Keyboard = {};

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
    let keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = true;
    }
};

Keyboard._onKeyUp = function (event) {
    let keyCode = event.keyCode;
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


class Game extends Component {

    constructor(props) {
        super(props);
        document.body.style.overflow = "hidden";


        this.state = {
            context: this.context,
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            msg: "",
            num_of_players: this.props.numPlayers,
            players: this.props.players,
            game_status: "not started",
            images: {},
            walls: [],
            hitpoints: [],

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
                isSolidTileAtXY: function (x, y) {
                    let col = Math.floor(x / this.tsize);
                    let row = Math.floor(y / this.tsize);
                    let tile = this.getTile(col, row);
                    if (tile === 2 || tile === 3) {
                        return true;
                    } else {
                        return false;
                    }

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

    initWalls() {

        this.state.walls.push(new Wall(new Point(0, 0), new Point(0, this.canvas.height)));
        this.state.walls.push(new Wall(new Point(0, this.canvas.height), new Point(this.canvas.width, this.canvas.height)));
        this.state.walls.push(new Wall(new Point(this.canvas.width, this.canvas.height), new Point(this.canvas.width, 0)));
        this.state.walls.push(new Wall(new Point(this.canvas.width, 0), new Point(0, 0)))
    }

    run(context) {
        this.ctx = context;
        this._previousElapsed = 0;

        this.init();
        this.tick2();
    }
    // tick() {
    //     // window.requestAnimationFrame(this.tick);

    //     // clear previous frame


    //     setInterval(() => {
    //         // this.update();
    //         this.ctx.clearRect(0, 0, 1024, 640);
    //         let delta = .1;
    //         // let delta = (elapsed - this._previousElapsed) / 1000.0;
    //         delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    //         // this._previousElapsed = elapsed;

    //         this.update(delta);
    //         this.gameRender();
    //     }, 1000 / 120);


    // };//.bind(Game);

    tick2() {
        this.ctx.clearRect(0, 0, 1024, 640);
        let delta = .1;
        delta = Math.min(delta, 0.25); // maximum delta of 250 ms

        this.update(delta);
        this.gameRender();

        window.requestAnimationFrame(this.tick2.bind(this));

    }


    init() {
        Keyboard.listenForEvents(
            [Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);
        // this.tileAtlas = Loader.getImage('tiles');
        this.Player = new Player(this.state.map, 160, 160);
        this.camera = new Camera(this.state.map, 1024, 640);
        this.camera.follow(this.Player)

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
        // this.walls = [];

        let startCol = Math.floor(this.camera.x / this.state.map.tsize);
        let endCol = startCol + (this.camera.width / this.state.map.tsize);
        let startRow = Math.floor(this.camera.y / this.state.map.tsize);
        let endRow = startRow + (this.camera.height / this.state.map.tsize);
        let offsetX = -this.camera.x + startCol * this.state.map.tsize;
        let offsetY = -this.camera.y + startRow * this.state.map.tsize;

        for (let c = startCol; c <= endCol; c++) {
            for (let r = startRow; r <= endRow; r++) {
                let tile = this.state.map.getTile(c, r);
                let x = (c - startCol) * this.state.map.tsize + offsetX;
                let y = (r - startRow) * this.state.map.tsize + offsetY;
                if (tile !== 0) { // 0 => empty tile

                    this.ctx.beginPath();
                    this.ctx.rect(Math.round(x), Math.round(y), 64, 64);
                    if (tile === 1) {
                        this.ctx.fillStyle = '#F7F3F0';
                    } else if (tile === 2) {
                        this.ctx.fillStyle = '#D9C9BD';
                        this.updateWalls(x, y);
                    } else {
                        this.ctx.fillStyle = '#918C87';
                        // this.updateWalls(x, y);
                    }
                    this.ctx.stroke();
                    this.ctx.fill();

                }
            }
        }
    }

    updateWalls(x, y) {
        //Top side of a square
        this.state.walls.push(new Wall(new Point(Math.round(x), Math.round(y)), new Point(Math.round(x + 64), Math.round(y))));
        //Right side of a square
        this.state.walls.push(new Wall(new Point(Math.round(x + 64), Math.round(y)), new Point(Math.round(x + 64), Math.round(y + 64))));
        //Bottom side of a square
        this.state.walls.push(new Wall(new Point(Math.round(x + 64), Math.round(y + 64)), new Point(Math.round(x), Math.round(y + 64))));
        //Left side of a square
        this.state.walls.push(new Wall(new Point(Math.round(x), Math.round(y + 64)), new Point(Math.round(x), Math.round(y))));

    };

    updateLightTrace() {
        let playerX = (this.Player.screenX - this.Player.width / 2) + 32;
        let playerY = (this.Player.screenY - this.Player.height / 2) + 32;
        // this.setState({hitpoints: []});
        this.state.hitpoints = [];
        // For every wall...
        for (var i = 0; i < this.state.walls.length; i++) {
            var wall = this.state.walls[i];
            // Cast a ray to every point of the current wall
            for (var j = 0; j < wall.points.length; j++) {
                var closestPoint = null;
                if (j === 0) closestPoint = wall.p1;
                if (j === 1) closestPoint = wall.p2;
                var ray = new Wall(new Point(playerX, playerY), new Point(closestPoint.x, closestPoint.y));
                var minDistance = ray.length();
                // Check every wall for intersection
                for (var k = 0; k < this.state.walls.length; k++) {
                    var checkWall = this.state.walls[k];
                    if (wall !== checkWall) {
                        if (checkWall.intersectsWith(ray)) {
                            // If checkWall intersects with our ray we have to check it's intersection point's distance
                            // If the distance is smaller than the current minimum set intersectionPoint as the closest
                            // point and save the distance.
                            var intersectionPoint = checkWall.intersectionPoint(ray);
                            var tempRay = new Wall(new Point(playerX, playerY), new Point(intersectionPoint.x, intersectionPoint.y));
                            if (tempRay.length() < minDistance) {
                                closestPoint = intersectionPoint;
                                minDistance = tempRay.length();
                            }
                        }
                    }
                }
                this.state.hitpoints.push(closestPoint);
            }
        }
    };

    drawPlayer() {
        // draw main character
        this.ctx.beginPath();
        this.ctx.rect(this.Player.screenX - this.Player.width / 2, this.Player.screenY - this.Player.height / 2, 64, 64);
        this.ctx.fillStyle = '#007E8F';
        this.ctx.fill();
    };
    drawLight() {
        this.ctx.fillStyle = "#0000FF";
        let playerX = (this.Player.screenX - this.Player.width / 2) + 32;
        let playerY = (this.Player.screenY - this.Player.height / 2) + 32;
        this.ctx.strokeStyle = "#FF0000";
        this.ctx.beginPath();
        for (let i = 0; i < this.state.hitpoints.length; i++) {
            let hitpoint = this.state.hitpoints[i];
            this.ctx.moveTo(playerX, playerY);
            this.ctx.lineTo(hitpoint.x, hitpoint.y);
            this.ctx.fillRect(hitpoint.x - 5, hitpoint.y - 5, 10, 10);
        }
        this.ctx.stroke();
        // this.ctx.restore();
    };

    gameRender() {
        this.drawLayer();
        this.drawPlayer();
        this.updateLightTrace();
        this.drawLight();
    };


    componentDidMount() {
        this.setState({ game_status: "in progress" });
        // this will only happen the first time, and will set the ball rolling to handle any updates!
        // this.state.context = this.refs.canvas.getContext('2d');
        let context = this.refs.canvas.getContext('2d');

        this.setState({ context: this.refs.canvas.getContext('2d') });

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
        }

        return <div>{component_insides}</div>;

    };

    render() {
        return (
            <div>
                <canvas ref="canvas" width={1024} height={620} />
            </div>
        );
    }

}

export default Game;
