import React, { Component } from 'react';

// import Player from './Player';

import OtherPlayers from './OtherPlayers';

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

    keys.forEach(
        function (key) {
            this._keys[key] = false;
        }.bind(this)
    );
};

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

// function Camera(map, width, height) {
//     this.x = 0;
//     this.y = 0;
//     this.width = width;
//     this.height = height;
//     this.maxX = map.cols * map.tsize - width;
//     this.maxY = map.rows * map.tsize - height;
// }

// Camera.prototype.follow = function (sprite) {
//     this.following = sprite;
//     sprite.screenX = 0;
//     sprite.screenY = 0;
// };

// Camera.prototype.update = function () {
//     console.log('camera update')
//     // assume followed sprite should be placed at the center of the screen
//     // whenever possible
//     this.following.screenX = this.width / 2;
//     this.following.screenY = this.height / 2;

//     // make the camera follow the sprite
//     this.x = this.following.x - this.width / 2;
//     this.y = this.following.y - this.height / 2;
//     // clamp values
//     this.x = Math.max(0, Math.min(this.x, this.maxX));
//     this.y = Math.max(0, Math.min(this.y, this.maxY));

//     // in map corners, the sprite cannot be placed in the center of the screen
//     // and we have to change its screen coordinates

//     // left and right sides
//     if (this.following.x < this.width / 2 ||
//         this.following.x > this.maxX + this.width / 2) {
//         this.following.screenX = this.following.x - this.x;
//     }
//     // top and bottom sides
//     if (this.following.y < this.height / 2 ||
//         this.following.y > this.maxY + this.height / 2) {
//         this.following.screenY = this.following.y - this.y;
//     }
// };

// function Player(map, x, y) {
//     this.map = map;
//     this.x = x;
//     this.y = y;
//     this.width = map.tsize;
//     this.height = map.tsize;

//     // this.image = Loader.getImage('Player');
// }

// Player.SPEED = 256; // pixels per second

// Player.prototype.move = function (delta, dirx, diry) {
//     // move
//     // if(dirx === 1){
//     //     this.x = this.x + 64;
//     // }else if(dirx === -1){
//     //     this.x = this.x - 64;
//     // }
//     this.x += dirx ;
//     this.y += diry ;
//     console.log(dirx +' '+diry)
//     // check if we walked into a non-walkable tile
//     this._collide(dirx, diry);

//     // clamp values
//     var maxX = this.map.cols * this.map.tsize;
//     var maxY = this.map.rows * this.map.tsize;
//     this.x = Math.max(0, Math.min(this.x, maxX));
//     this.y = Math.max(0, Math.min(this.y, maxY));
// };

// Player.prototype._collide = function (dirx, diry) {
//     var row, col;
//     // -1 in right and bottom is because image ranges from 0..63
//     // and not up to 64
//     var left = this.x - this.width / 2;
//     var right = this.x + this.width / 2 - 1;
//     var top = this.y - this.height / 2;
//     var bottom = this.y + this.height / 2 - 1;

//     // check for collisions on sprite sides
//     var collision =
//         this.map.isSolidTileAtXY(left, top) ||
//         this.map.isSolidTileAtXY(right, top) ||
//         this.map.isSolidTileAtXY(right, bottom) ||
//         this.map.isSolidTileAtXY(left, bottom);
//     if (!collision) { return; }

//     if (diry > 0) {
//         row = this.map.getRow(bottom);
//         this.y = -this.height / 2 + this.map.getY(row);
//     }
//     else if (diry < 0) {
//         row = this.map.getRow(top);
//         this.y = this.height / 2 + this.map.getY(row + 1);
//     }
//     else if (dirx > 0) {
//         col = this.map.getCol(right);
//         this.x = -this.width / 2 + this.map.getX(col);
//     }
//     else if (dirx < 0) {
//         col = this.map.getCol(left);
//         this.x = this.width / 2 + this.map.getX(col + 1);
//     }
// };

class Game extends Component {
    constructor(props) {
        super(props);

        document.body.style.overflow = "hidden";

        this.state = {
            context: this.context,
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            msg: '',
            num_of_players: this.props.numPlayers,
            players: this.props.players,

            gameID: this.props.gameID,
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
                    return this.tiles[row * this.cols + col];
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

        socket.on('player moved', (position) => {
            console.log(
            !(position.X === this.player.x && position.Y === this.player.y) ? "myself! Or collision?": "This is where favians function fires!")
        });

        this.update_player_component = this.update_player_component.bind(this);
    }

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
        let delta = .25;
        delta = Math.min(delta, 0.25); // maximum delta of 250 ms

        this.update(delta);
        this.gameRender();

        window.requestAnimationFrame(this.tick2.bind(this));

    }


    init() {
        Keyboard.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);
        // this.tileAtlas = Loader.getImage('tiles');
        this.Player = new Player(this.state.map, 160, 160);
        this.camera = new Camera(this.state.map, 1024, 640);
        this.camera.follow(this.Player);
    }

    update(delta) {
        // handle Player movement with arrow keys
        let dirx = 0;
        let diry = 0;
        if (Keyboard.isDown(Keyboard.LEFT)) {
            dirx = -1;
        } else if (Keyboard.isDown(Keyboard.RIGHT)) {
            dirx = 1;
        } else if (Keyboard.isDown(Keyboard.UP)) {
            diry = -1;
        } else if (Keyboard.isDown(Keyboard.DOWN)) {
            diry = 1;
        }

        this.Player.move(delta, dirx, diry);

        let info = {
            gameID: this.state.gameID,
            X: this.Player.X,
            Y: this.Player.Y
        };

        socket.emit("player movement", info);
        this.camera.update();
    }

    drawLayer() {
        // this.state.walls = [];
        this.setState({walls: []});


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
                        this.ctx.fillStyle = '#0c0c0c';
                    } else if (tile === 2) {
                        this.ctx.fillStyle = '#0c0c0c';
                        this.updateWalls(x, y);
                    } else {
                        this.ctx.fillStyle = '#0c0c0c';
                        this.updateWalls(x, y);
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

        this.state.walls.push(new Wall(new Point(0, 0), new Point(1024, 0)));
        this.state.walls.push(new Wall(new Point(0, 0), new Point(0, 620)));
        this.state.walls.push(new Wall(new Point(0, 620), new Point(1024, 620)));
        this.state.walls.push(new Wall(new Point(1024, 620), new Point(1024, 0)));
    };

    // updateLightTrace() {
    //     let playerX = (this.Player.screenX - this.Player.width / 2) + 32;
    //     let playerY = (this.Player.screenY - this.Player.height / 2) + 32;
    //     this.setState({hitpoints: []});
    //     // this.state.hitpoints = [];
    //     // For every wall...
    //     console.log(this.state.walls.length);
    //     for (let i = 0; i < this.state.walls.length; i++) {
    //         let wall = this.state.walls[i];
    //         // Cast a ray to every point of the current wall
    //         for (let j = 0; j < wall.points.length; j++) {
    //             let closestPoint = null;
    //             if (j === 0) closestPoint = wall.p1;
    //             if (j === 1) closestPoint = wall.p2;
    //             let ray = new Wall(new Point(playerX, playerY), new Point(closestPoint.x, closestPoint.y));
    //             let minDistance = ray.length();
    //             // Check every wall for intersection
    //             for (let k = 0; k < this.state.walls.length; k++) {
    //                 let checkWall = this.state.walls[k];
    //                 if (wall !== checkWall) {
    //                     if (checkWall.intersectsWith(ray)) {
    //                         // If checkWall intersects with our ray we have to check it's intersection point's distance
    //                         // If the distance is smaller than the current minimum set intersectionPoint as the closest
    //                         // point and save the distance.
    //                         let intersectionPoint = checkWall.intersectionPoint(ray);
    //                         let tempRay = new Wall(new Point(playerX, playerY), new Point(intersectionPoint.x, intersectionPoint.y));
    //                         if (tempRay.length() < minDistance) {
    //                             closestPoint = intersectionPoint;
    //                             minDistance = tempRay.length();
    //                         }
    //                     }
    //                 }
    //             }
    //             this.state.hitpoints.push(closestPoint);
    //         }
    //     }
    // };

    getIntersection(ray, segment) {

        // RAY in parametric: Point + Delta*T1
        let r_px = ray.a.x;
        let r_py = ray.a.y;
        let r_dx = ray.b.x - ray.a.x;
        let r_dy = ray.b.y - ray.a.y;

        // SEGMENT in parametric: Point + Delta*T2
        let s_px = segment.p1.x;
        let s_py = segment.p1.y;
        let s_dx = segment.p2.x - segment.p1.x;
        let s_dy = segment.p2.y - segment.p1.y;

        // Are they parallel? If so, no intersect
        let r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
        let s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
        if (r_dx / r_mag === s_dx / s_mag && r_dy / r_mag === s_dy / s_mag) {
            // Unit vectors are the same.
            return null;
        }

        // SOLVE FOR T1 & T2
        // r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
        // ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
        // ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
        // ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
        let T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
        let T1 = (s_px + s_dx * T2 - r_px) / r_dx;

        // Must be within parametic whatevers for RAY/SEGMENT
        if (T1 < 0) return null;
        if (T2 < 0 || T2 > 1) return null;

        // Return the POINT OF INTERSECTION
        return {
            x: r_px + r_dx * T1,
            y: r_py + r_dy * T1,
            param: T1
        };

    }


    updateLightTrace() {

        let playerX = (this.Player.screenX - this.Player.width / 2) + 32;
        let playerY = (this.Player.screenY - this.Player.height / 2) + 32;

        let points = [];
        for (let a = 0; a < this.state.walls.length; a++) {
            let wall = this.state.walls[a];
            for (let b = 0; b < wall.points.length; b++) {
                points.push(wall.points[b]);
            }
        }
        let uniquePoints = (function (points) {
            let set = {};
            return points.filter(function (p) {
                let key = p.x + "," + p.y;
                if (key in set) {
                    return false;
                } else {
                    set[key] = true;
                    return true;
                }
            });
        })(points);

        // Get all angles
        let uniqueAngles = [];
        for (let j = 0; j < uniquePoints.length; j++) {
            let uniquePoint = uniquePoints[j];
            let angle = Math.atan2(uniquePoint.y - playerY, uniquePoint.x - playerX);
            uniquePoint.angle = angle;
            uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001);
        }

        // RAYS IN ALL DIRECTIONS
        let intersects = [];
        this.setState({hitpoints: []});
        for (let j = 0; j < uniqueAngles.length; j++) {
            let angle = uniqueAngles[j];

            // Calculate dx & dy from angle
            let dx = Math.cos(angle);
            let dy = Math.sin(angle);

            // Ray from center of screen to mouse
            let ray = {
                a: { x: playerX, y: playerY },
                b: { x: playerX + dx, y: playerY + dy }
            };

            // Find CLOSEST intersection
            let closestIntersect = null;
            for (let i = 0; i < this.state.walls.length; i++) {
                let wall = this.state.walls[i];
                let intersect = this.getIntersection(ray, wall);
                if (!intersect) continue;
                if (!closestIntersect || intersect.param < closestIntersect.param) {
                    closestIntersect = intersect;
                }
            }

            // Intersect angle
            if (!closestIntersect) continue;
            closestIntersect.angle = angle;

            // Add to list of intersects
            this.state.hitpoints.push(closestIntersect);



            // let playerX = (this.Player.screenX - this.Player.width / 2) + 32;
            // let playerY = (this.Player.screenY - this.Player.height / 2) + 32;
            // this.setState({ uniqueAngles: [] });
            // for (let j = 0; points.length; j++) {
            //     let uniquePoint = points[j];
            //     let angle = Math.atan2(uniquePoint.y - playerY, uniquePoint.x - playerX);
            //     uniquePoint.angle = angle;
            //     this.state.uniqueAngles.push(angle - 0.00001, angle + 0.00001);
            // }
        };
    };

    sortAngles() {
        let sortedAngles = this.state.hitpoints.sort(function (a, b) {
            return a.angle - b.angle;
        });
        this.setState({ hitpoints: sortedAngles });
    }


    drawPlayer() {
        // draw main character
        this.ctx.beginPath();
        this.ctx.rect(this.Player.screenX - this.Player.width / 2, this.Player.screenY - this.Player.height / 2, 64, 64);
        this.ctx.fillStyle = '#D5C7BC';
        this.ctx.fill();
    };

    drawLight(){
        let playerX = (this.Player.screenX - this.Player.width / 2) + 32;
        let playerY = (this.Player.screenY - this.Player.height / 2) + 32;

        this.ctx.save();
        let fill = this.ctx.createRadialGradient(playerX,playerY,1, playerX, playerY, 300);
        fill.addColorStop(0, "rgba(255, 255, 255, 0.6)");
        fill.addColorStop(0.9,"rgba(255, 255, 255, 0.01)");
        fill.addColorStop(1,"rgba(255, 255, 255, 0.009)");

        


        this.ctx.fillStyle = fill;

        this.ctx.beginPath();
        this.ctx.moveTo(this.state.hitpoints[0].x, this.state.hitpoints[0].y);
        for(let i = 1; i< this.state.hitpoints.length ; i++){
            let intersect = this.state.hitpoints[i];
            this.ctx.lineTo(intersect.x, intersect.y)
        }

        
        this.ctx.fill();
        
        this.ctx.restore();

    }
    drawShadow(){
        this.ctx.save();
        this.ctx.fillStyle = "ccc";
        this.ctx.beginPath();
        this.ctx.moveTo(this.state.hitpoints[0].x, this.state.hitpoints[0].y);
        for(let i = 1; i< this.state.hitpoints.length ; i++){
            let intersect = this.state.hitpoints[i];
            this.ctx.lineTo(intersect.x, intersect.y)
        }
        this.ctx.rect(1024, 0, -1024, 620);
        
        this.ctx.fill();
        this.ctx.restore();

    }
    drawLightLines() {
        this.ctx.save();
        let playerX = (this.Player.screenX - this.Player.width / 2) + 32;
        let playerY = (this.Player.screenY - this.Player.height / 2) + 32;
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.beginPath();
        for (let i = 0; i < this.state.hitpoints.length; i++) {
            let hitpoint = this.state.hitpoints[i];
            this.ctx.moveTo(playerX, playerY);
            this.ctx.lineTo(hitpoint.x, hitpoint.y);
            // this.ctx.fillRect(hitpoint.x - 5, hitpoint.y - 5, 10, 10);
        }
        this.ctx.stroke();
        this.ctx.restore();
    };

    gameRender() {
        this.drawLayer();
        this.updateLightTrace();
        this.sortAngles();
        // this.drawLightLines();
        this.drawLight();
        this.drawShadow();
        this.drawPlayer();

    };


    componentDidMount() {
        this.setState({ game_status: 'in progress' });
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
                component_insides.push(
                    <Player
                        key={players_arr[i][0]}
                        keyVal={players_arr[i][0]}
                        xPos={players_arr[i][1].x}
                        yPos={players_arr[i][1].y}
                    />
                );
                //console.log(component_insides[0].props);
            } else {
                component_insides.push(
                    <OtherPlayers
                        key={players_arr[i][0]}
                        keyVal={players_arr[i][0]}
                        xPos={players_arr[i][1].x}
                        yPos={players_arr[i][1].y}
                    />
                );
            }
        }

        for (let i = 0; i < players_arr.length; i++) {
        }

        return <div>{component_insides}</div>;
    }

    render() {
        return (
            <div className="gameAction">
                <div className="alivePlayers">
                    <ul className="aliveList">
                        <li>
                            <img src="https://scontent.fyyc5-1.fna.fbcdn.net/v/t31.0-8/21743593_2110943032265084_6203761706521445673_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_oc=AQlDJBhH_6U0KA1xQ-EqEn8oH3PVboShBOYtAlCNGUMMibi5lGFE02Q8aISjPD6HdhzaZpz6xjxPYgIeI2jzxTrq&_nc_ht=scontent.fyyc5-1.fna&oh=abde33669f8da29cfe3a140b08b570b0&oe=5EB25D58" />
                        </li>
                        <li>
                            <img src="https://scontent.fyyc5-1.fna.fbcdn.net/v/t31.0-8/21743593_2110943032265084_6203761706521445673_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_oc=AQlDJBhH_6U0KA1xQ-EqEn8oH3PVboShBOYtAlCNGUMMibi5lGFE02Q8aISjPD6HdhzaZpz6xjxPYgIeI2jzxTrq&_nc_ht=scontent.fyyc5-1.fna&oh=abde33669f8da29cfe3a140b08b570b0&oe=5EB25D58" />
                        </li>
                        <li>
                            <img src="https://scontent.fyyc5-1.fna.fbcdn.net/v/t31.0-8/21743593_2110943032265084_6203761706521445673_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_oc=AQlDJBhH_6U0KA1xQ-EqEn8oH3PVboShBOYtAlCNGUMMibi5lGFE02Q8aISjPD6HdhzaZpz6xjxPYgIeI2jzxTrq&_nc_ht=scontent.fyyc5-1.fna&oh=abde33669f8da29cfe3a140b08b570b0&oe=5EB25D58" />
                        </li>
                        <li>
                            <img src="https://scontent.fyyc5-1.fna.fbcdn.net/v/t31.0-8/21743593_2110943032265084_6203761706521445673_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_oc=AQlDJBhH_6U0KA1xQ-EqEn8oH3PVboShBOYtAlCNGUMMibi5lGFE02Q8aISjPD6HdhzaZpz6xjxPYgIeI2jzxTrq&_nc_ht=scontent.fyyc5-1.fna&oh=abde33669f8da29cfe3a140b08b570b0&oe=5EB25D58" />
                        </li>
                        <li>
                            <img src="https://scontent.fyyc5-1.fna.fbcdn.net/v/t31.0-8/21743593_2110943032265084_6203761706521445673_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_oc=AQlDJBhH_6U0KA1xQ-EqEn8oH3PVboShBOYtAlCNGUMMibi5lGFE02Q8aISjPD6HdhzaZpz6xjxPYgIeI2jzxTrq&_nc_ht=scontent.fyyc5-1.fna&oh=abde33669f8da29cfe3a140b08b570b0&oe=5EB25D58" />
                        </li>
                        <li>
                            <img src="https://scontent.fyyc5-1.fna.fbcdn.net/v/t31.0-8/21743593_2110943032265084_6203761706521445673_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_oc=AQlDJBhH_6U0KA1xQ-EqEn8oH3PVboShBOYtAlCNGUMMibi5lGFE02Q8aISjPD6HdhzaZpz6xjxPYgIeI2jzxTrq&_nc_ht=scontent.fyyc5-1.fna&oh=abde33669f8da29cfe3a140b08b570b0&oe=5EB25D58" />
                        </li>
                    </ul>
                </div>
                <canvas ref="canvas" width={1024} height={620} />
            </div>
        );
    }
}

export default Game;
