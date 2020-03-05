import React, {Component} from 'react';




class Player extends Component{

    /*constructor(props) {
        super(props);

    }*/


    render() {
        const player_attr = {
            width: 20,
            height: 20,
            top: this.props.yPos,
            left: this.props.xPos,
            position: 'absolute'
        };

        return (
            <img src={this.props.playerImage}
                 style={player_attr}
                 alt="Player sprite for the game"
            />
        );
    }
}

export default Player;