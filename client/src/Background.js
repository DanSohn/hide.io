import React, {Component} from 'react';

class Background extends Component{

    constructor(props) {
        super(props);

    }


    render() {
        const background_attr = {
            width: `calc(${this.props.windowWidth}px)`,
            height: `calc(${this.props.windowHeight}px)`,
            top: 0,
            left: 0,
            position: 'absolute'
        };

        return (
            <img src={this.props.backgroundImage}
                 style={background_attr}
                 alt="Background screen for the game"
            />
        );
    }
}

export default Background;