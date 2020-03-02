import React, {Component} from 'react';

class Game extends Component {
    constructor(props) {
        super(props);

        document.body.style.overflow = "hidden";

        this.state = {
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,

            playerX: 300,
            playerY: 300,
            playerSpeed: 10,
            msg: ""

        };

        this.onKeyDown = this.onKeyDown.bind(this);

    }


    onKeyDown(e) {
        switch (e.which) {
            case 37: // Left
                this.playerMove(this.state.playerX - this.state.playerSpeed, this.state.playerY);
                break;
            case 38: // Up
                this.playerMove(this.state.playerX, this.state.playerY - this.state.playerSpeed);
                break;
            case 39: // Right
                this.playerMove(this.state.playerX + this.state.playerSpeed, this.state.playerY);
                break;
            case 40: // Down
                this.playerMove(this.state.playerX, this.state.playerY + this.state.playerSpeed);
                break;
            default:
                break;
        }
    }

    playerMove(x, y) {
        this.setState({
            playerX: x,
            playerY: y
        });
    }

    /*
        componentDidMount() {
            console.log("in game mounting");
            //console.log("socket" + socket);

            socket.on('hello', ()=>{
                console.log("hello!!!");
            });


        }
    */
    render() {
        console.log("in game rendering");
        return (
            <div>
                <canvas ref="canvas" style={{backgroundColor: 'yellow'}} width={1800} height={700}/>
            </div>
        )

        return (
            <div onKeyDown={this.onKeyDown} tabIndex="0">
                <Background backgroundImage={backgroundImg}
                            windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight}/>
                <Car carImage={carImg} centreX={this.state.playerX}
                     centreY={this.state.playerY} width={this.playerWidth}
                     height={this.playerHeight}/>
            </div>)
    }
}

export default Game;