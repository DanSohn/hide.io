import React, {Component} from 'react';
import player_img from "./assets/player.png";


class Player extends Component {

    constructor(props) {
        super(props);

        this.state = {
            playerX: this.props.xPos,
            playerY: this.props.yPos,
            playerSpeed: 50,

        };
        this.onKeyDown = this.onKeyDown.bind(this);

    }

    componentDidMount() {
        window.onkeydown = this.onKeyDown;
    }


    onKeyDown(e) {
        console.log("key pressed");
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
        console.log("key pressed");

        this.setState({
            playerX: x,
            playerY: y
        });
    }

    render() {
        const player_attr = {
            width: 20,
            height: 20,
            top: this.state.playerY,
            left: this.state.playerX,
            position: 'absolute'
        };

        return (
            <img src={player_img}
                 width={200}
                 style={player_attr}
                 alt="Player sprite for the game"
            />
        );
    }
}

export default Player;