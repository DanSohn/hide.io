import React from 'react';

function Background(props) {
    const background_attr = {
        width: `calc(${props.windowWidth}px)`,
        height: `calc(${props.windowHeight}px)`,
        top: 0,
        left: 0,
        position: 'absolute'
    };

    return (
        <img src={props.backgroundImage}
             style={background_attr}
             alt="background_img"
             />
    );
}

export default Background;