import React, { Component } from "react";
import OtherPlayers from "./OtherPlayers";

import "../assets/App.css";

import Wall from "./Wall";
import Camera from "./Camera";
import Player from "./PlayerTest";
import { socket } from "../assets/socket";

import Point from "./Point";
import Timer from "../Game/Timer";
import AliveList from "./aliveList";

// import Keyboard from './Keyboard'
let Keyboard = {};

Keyboard.LEFT = 37;
Keyboard.RIGHT = 39;
Keyboard.UP = 38;
Keyboard.DOWN = 40;

Keyboard._keys = {};

Keyboard.listenForEvents = function (keys) {
    window.addEventListener("keydown", this._onKeyDown.bind(this));
    window.addEventListener("keyup", this._onKeyUp.bind(this));

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
        throw new Error("Keycode " + keyCode + " is not being listened to");
    }
    return this._keys[keyCode];
};

class Game extends Component {
    constructor(props) {
        super(props);

        // // if its a seeker use the standardized color, else randomize a hex color
        // if (this.state.playerState === "seeker")
        //     let playerColor = "#D5C7BC";
        // else
        //     let playerColor= '#'+Math.floor(Math.random()*16777215).toString(16);
        let playerColor = this.props.playerState === "seeker" ? "#D5C7BC" : '#' + Math.floor(Math.random() * 16777215).toString(16);

        document.body.style.overflow = "hidden";

        this.state = {
            context: this.context,
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            msg: "",
            num_of_players: this.props.numPlayers,
            players: this.props.players,
            playerState: this.props.location.state.playerState,
            playerColor: playerColor,

            gameID: this.props.location.state.gameID,
            game_status: "not started",
            walls: [],
            hitpoints: [],
            enamies: new Map(),

            alive: true,

            //Game window size, it is used in the calculation of what portion of the map is viewed.
            timeLimit: this.props.location.state.timeLimit,
            countdown: true,

            //This will be handling current game functions, and constants
            map: {
                cols: this.props.location.state.map.cols,
                rows: this.props.location.state.map.rows,
                tsize: this.props.location.state.map.tsize,
                tiles: this.props.location.state.map.tiles,
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
                },
            },
        };
        console.log("AM I THE SEEKER?", this.state.playerState);
        console.log(this.props.playerState);
        // TODO: do stuff when getting the location information
        socket.on('player moved', (playerinfo) => {

            if (socket.id !== playerinfo.id && playerinfo.room === this.state.gameID) {
                // console.log(playerinfo);
                this.state.enamies.set(playerinfo.id, playerinfo);
            }
        });

        // if the game is initiated, let the seeker move
        socket.on('game in progress', (game_time) => {
            if (game_time.seconds === 0) {
                this.state.game_status = 'started';
            }
        });
        this.update_player_component = this.update_player_component.bind(this);
    }

    //init game state seppereate from did load. could be used for start restrictions.
    init() {
        Keyboard.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);
        // this.tileAtlas = Loader.getImage('tiles');
        if(this.state.playerState === "seeker"){
            this.Player = new Player(this.state.map, 160, 160);
        }else{
            this.Player = new Player(this.state.map, 288, 160);
        }
        this.camera = new Camera(this.state.map, 1024, 640);
        this.camera.follow(this.Player);
    }

    drawLayer() {
        this.setState({ walls: [] });

        let tileSize = this.state.map.tsize;
        //calculate camera view space and attains apropriate start and end of the render space.
        let startCol = Math.floor(this.camera.x / tileSize);//
        let endCol = startCol + this.camera.width / tileSize;
        let startRow = Math.floor(this.camera.y / tileSize);
        let endRow = startRow + this.camera.height / tileSize;
        let offsetX = -this.camera.x + startCol * tileSize;
        let offsetY = -this.camera.y + startRow * tileSize;
        // console.log('combined ' + startCol * this.state.map.tsize + offsetX);
        // console.log('offset'+offsetX);
        // console.log('camera'+this.camera.x);
        for (let c = startCol; c <= endCol; c++) {
            for (let r = startRow; r <= endRow; r++) {
                let tile = this.state.map.getTile(c, r);
                let x = (c - startCol) * tileSize + offsetX;
                let y = (r - startRow) * tileSize + offsetY;
                // console.log('draw'+x)

                if (tile !== 0) {
                    // 0 => empty tile

                    this.ctx.beginPath();
                    this.ctx.rect(Math.round(x), Math.round(y), tileSize, tileSize);

                    //Floor tile --- traversable.
                    if (tile === 1) {
                        this.ctx.fillStyle = "#0c0c0c";

                        //Barracade tile -- non traversable
                    } else if (tile === 2) {
                        this.ctx.fillStyle = "#0c0c0c";
                        this.updateWalls(x, y);

                        //Map edge tile -- non traversable
                    } else {
                        this.ctx.fillStyle = "#0c0c0c";
                        this.updateWalls(x, y);
                    }
                    this.ctx.strokeStyle = "#FF0000";

                    this.ctx.stroke();
                    this.ctx.fill();
                }
            }
        }
    }
    //Add walls each frame to calculate the rays
    updateWalls(x, y) {
        //Top side of a square
        this.state.walls.push(
            new Wall(
                new Point(Math.round(x), Math.round(y)),
                new Point(Math.round(x + 64), Math.round(y))
            )
        );
        //Right side of a square
        this.state.walls.push(
            new Wall(
                new Point(Math.round(x + 64), Math.round(y)),
                new Point(Math.round(x + 64), Math.round(y + 64))
            )
        );
        //Bottom side of a square
        this.state.walls.push(
            new Wall(
                new Point(Math.round(x + 64), Math.round(y + 64)),
                new Point(Math.round(x), Math.round(y + 64))
            )
        );
        //Left side of a square
        this.state.walls.push(
            new Wall(
                new Point(Math.round(x), Math.round(y + 64)),
                new Point(Math.round(x), Math.round(y))
            )
        );

        //uses camera view border to emulate a wall so that the light is used for the current view position
        this.state.walls.push(new Wall(new Point(0, 0), new Point(1024, 0)));
        this.state.walls.push(new Wall(new Point(0, 0), new Point(0, 620)));
        this.state.walls.push(new Wall(new Point(0, 620), new Point(1024, 620)));
        this.state.walls.push(new Wall(new Point(1024, 620), new Point(1024, 0)));
    }

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

        let T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
        let T1 = (s_px + s_dx * T2 - r_px) / r_dx;

        // Must be within parametic whatevers for RAY/SEGMENT
        if (T1 < 0) return null;
        if (T2 < 0 || T2 > 1) return null;

        // Return the POINT OF INTERSECTION
        return {
            x: r_px + r_dx * T1,
            y: r_py + r_dy * T1,
            param: T1,
        };
    }

    updateLightTrace() {
        let playerX = this.Player.screenX - this.Player.width / 2 + 32;
        let playerY = this.Player.screenY - this.Player.height / 2 + 32;

        //get all points from the walls p1 and p2
        let points = [];
        for (let a = 0; a < this.state.walls.length; a++) {
            let wall = this.state.walls[a];
            for (let b = 0; b < wall.points.length; b++) {
                points.push(wall.points[b]);
            }
        }

        //remove duplicated points --save that cpu
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
        this.setState({ hitpoints: [] });
        for (let j = 0; j < uniqueAngles.length; j++) {
            let angle = uniqueAngles[j];

            // Calculate dx & dy from angle
            let dx = Math.cos(angle);
            let dy = Math.sin(angle);

            // Ray from center of screen to mouse
            let ray = {
                a: { x: playerX, y: playerY },
                b: { x: playerX + dx, y: playerY + dy },
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
        }
    }
    //sort angles so the polygon can be drawn from  0th hitpoint to 360 degrees.
    sortAngles() {
        let sortedAngles = this.state.hitpoints.sort(function (a, b) {
            return a.angle - b.angle;
        });
        this.setState({ hitpoints: sortedAngles });
    }

    drawEnamy() { }

    //Draws the rays from each point from this.state.hitpoints -- DISABLED -- used to Debug
    drawLightLines() {
        this.ctx.save();
        let playerX = this.Player.screenX - this.Player.width / 2 + 32;
        let playerY = this.Player.screenY - this.Player.height / 2 + 32;
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
    }

    // Goes through each hitpoint to create a visibile light polygon - then a circular light emits from players x y position- first circle is more intense than second circle
    drawLight() {
        let playerX = this.Player.screenX - this.Player.width / 2 + 32;
        let playerY = this.Player.screenY - this.Player.height / 2 + 32;

        let lightRadius = this.state.playerState === "seeker" ? 300 : 150;

        this.ctx.save();
        let fill = this.ctx.createRadialGradient(playerX, playerY, 1, playerX, playerY, lightRadius);
        fill.addColorStop(0, "rgba(255, 255, 255, 0.65)");
        fill.addColorStop(0.9, "rgba(255, 255, 255, 0.01)");
        fill.addColorStop(1, "rgba(255, 255, 255, 0.009)");

        this.ctx.fillStyle = fill;


        this.ctx.beginPath();
        if (this.state.hitpoints.length > 0){
            this.ctx.beginPath();
            this.ctx.moveTo(this.state.hitpoints[0].x, this.state.hitpoints[0].y);
            for (let i = 1; i < this.state.hitpoints.length; i++) {
                let intersect = this.state.hitpoints[i];
                this.ctx.lineTo(intersect.x, intersect.y);
            }
        } else {
            this.ctx.rect(this.camera.x, this.camera.y, this.camera.width, this.camera.height)
        }
        this.ctx.fill();

        this.ctx.restore();
    }

    detectEnamies(playerValues){

        let enamyScreenX = (playerValues.x - this.camera.x);
        let enamyScreenY = (playerValues.y - this.camera.y);



            if (this.Player.screenX < enamyScreenX + this.state.map.tsize &&
                this.Player.screenX + this.state.map.tsize > enamyScreenX &&
                this.Player.screenY < enamyScreenY + this.state.map.tsize &&
                this.Player.screenY + this.state.map.tsize > enamyScreenY) {
                console.log("collision detected")
                socket.emit("player caught", playerValues.id)
                return;
            }

    }

    //Draws an inverse polygon layer that covers the shadows to remove the floor lines.
    drawShadow() {
        this.ctx.save();
        this.ctx.fillStyle = "#0b0b0b";

        if (this.state.hitpoints.length > 0){

        this.ctx.beginPath();
        this.ctx.moveTo(this.state.hitpoints[0].x, this.state.hitpoints[0].y);
        for (let i = 1; i < this.state.hitpoints.length; i++) {
            let intersect = this.state.hitpoints[i];
            this.ctx.lineTo(intersect.x, intersect.y);
        }
        this.ctx.rect(1024, 0, -1024, 620);

        this.ctx.fill();
        this.ctx.restore();
    }else{
        return;
    }
    }
    drawEnamies(enamyX, enamyY) {
        let enamyScreenX = (enamyX - this.camera.x) - this.Player.width / 2;
        let enamyScreenY = (enamyY - this.camera.y) - this.Player.height / 2;

        this.ctx.beginPath();
        this.ctx.rect(enamyScreenX, enamyScreenY, this.state.map.tsize, this.state.map.tsize);
        this.ctx.fillStyle = '#525252';
        this.ctx.fill();

        this.ctx.restore();



    }

    drawPillarLight() {
        let playerX = this.Player.screenX - this.Player.width / 2 + 32;
        let playerY = this.Player.screenY - this.Player.height / 2 + 32;

        this.ctx.save();
        let fill = this.ctx.createRadialGradient(playerX, playerY, 1, playerX, playerY, 64);
        fill.addColorStop(0, "rgba(255, 255, 255, 0.55)");
        fill.addColorStop(1, "rgba(255, 255, 255, 0.01)");

        this.ctx.fillStyle = fill;
        this.ctx.beginPath();
        this.ctx.moveTo(this.state.hitpoints[0].x, this.state.hitpoints[0].y);
        for (let i = 1; i < this.state.hitpoints.length; i++) {
            let intersect = this.state.hitpoints[i];
            this.ctx.lineTo(intersect.x, intersect.y);
        }
        this.ctx.rect(1024, 0, -1024, 620);

        this.ctx.fill();
        this.ctx.restore();
    }

    //Draws a player in the center of the screen. The camera will follow the player unless they are close to the edge of the map. -- Map in starting_positions.js
    drawPlayer() {
        // draw main character
        this.ctx.beginPath();
        this.ctx.rect(
            this.Player.screenX - this.Player.width / 2,
            this.Player.screenY - this.Player.height / 2,
            64,
            64
        );
        // set the playerColor
        this.ctx.fillStyle = this.state.playerColor;
        this.ctx.fill();
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
        if (this.state.game_status === 'started' || this.state.playerState === 'hider')
            this.Player.move(delta, dirx, diry, this.state.enamies);
        this.camera.update();
    }

    run(context) {
        this.ctx = context;
        this._previousElapsed = 0;
        this.init();
        this.tick();
    }

    //each game frame
    tick() {
        this.aliveStatusCheck();

            this.ctx.clearRect(0, 0, 1024, 640);
            let delta = 0.25;
            delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    
            let pastInfo = {
                roomID: this.state.gameID,
                x: this.Player.x,
                y: this.Player.y,
                id: socket.id,
            };

            //stops movement if they died.
            if(this.state.alive){
                this.update(delta);
            }
            this.gameRender();
    
            window.requestAnimationFrame(this.tick.bind(this));
    
            let info = {
                roomID: this.state.gameID,
                x: this.Player.x,
                y: this.Player.y,
                id: socket.id,
            };
            // Only send across socket if there's an update in position
            if (JSON.stringify(info) !== JSON.stringify(pastInfo)  && this.state.alive) {
                // console.log("I emitted:", info.x, info.y);
                // console.log('this.player.x=  ' + this.Player.x + '  this.Player.screenX=  ' + this.Player.screenX + '  camera x= ' + this.camera.x)
    
    
                socket.emit("player movement", info);
            }
   
    }

    aliveStatusCheck(){
        socket.on("I died", (playerID, playerName) => {
            if(playerID === socket.id){
                this.setState({alive: false})
            }

        });
    }

    gameRender() {
        let playerX = this.Player.screenX - this.Player.width / 2 + 32;
        let playerY = this.Player.screenY - this.Player.height / 2 + 32;

        this.drawLayer();
        // this.drawHiders();
        this.updateLightTrace();
        this.sortAngles();


        for (let playerValue of this.state.enamies.values()) {
            if (playerValue.x < this.camera.x || playerValue.y < this.camera.y || playerValue.x > this.camera.x + this.camera.width || playerValue.y > this.camera.y + this.camera.height) {
                break;
            } else {
                if(this.state.playerState === "seeker"){
                    this.detectEnamies(playerValue);
                }
                this.drawEnamies(playerValue.x, playerValue.y);
            }
        }


        this.drawLight(playerX, playerY);
        this.drawPlayer();

        this.drawShadow();
        // this.drawPillarLight();
    }

    componentDidMount() {
        // this will only happen the first time, and will set the ball rolling to handle any updates!
        // this.state.context = this.refs.canvas.getContext('2d');
        socket.emit("start game timer", this.state.gameID, this.state.timeLimit);
        console.log(this.state.timeLimit);
        let context = this.refs.canvas.getContext("2d");

        this.setState({ context: this.refs.canvas.getContext("2d") });

        this.run(context);

        socket.on("Redraw positions", (players) => {
            // if there has been a change to players' positions, then reset the state of players to new coordinates
            //console.log("original players ", this.state.players);
            if (this.state.players !== players) {
                this.setState({ players: players });
            }
        });

        socket.on("countdown", (seconds) => {
            if (seconds - 1 === 0) {
                this.setState({ countdown: false });
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

        for (let i = 0; i < players_arr.length; i++) { }

        return <div>{component_insides}</div>;
    }

    render() {
        // console.log(this.state.playerState==='seeker' && this.state.game_status === 'not started');
        let comp1;
        let comp2;
        let dragon = "";
        let canvasDisplay = this.state.playerState==='seeker' && this.state.game_status === 'not started' ? ['darkness',''] : ['','fade-in'];
        if (this.state.countdown === true) {
            if (this.state.playerState === 'seeker') {
                comp1 = "You're the seeker";
                comp2 = "Objective: Hunt them down.";
            }
            else {
                comp1 = "You are a hider";
                comp2 = "Objective: Hide BITCH";
            }
            dragon = (
                <React.Fragment>
                    <h1>{comp1}</h1>
                    <h5>{comp2}</h5>
                </React.Fragment>
            );
        } else if (this.state.countdown === false) {
            dragon = (
                <React.Fragment>
                    <h1></h1>
                    <h5></h5>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <Timer gameDuration={this.state.timeLimit.split(" ")[0]}
                    playerState={this.state.playerState} />
                <div className="gameAction">
                    <AliveList />
                    <div className={canvasDisplay[0]} />
                    <canvas className={canvasDisplay[1]} ref="canvas" width={1024} height={620} />
                    <div className="PlayerText">
                        <div className="fade-out-15">{dragon}</div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Game;
