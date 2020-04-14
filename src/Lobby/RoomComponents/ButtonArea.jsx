import React from "react";

export default function ButtonArea(props) {
    let header = props.header,
        time = props.time,
        setting = null;

    if (time !== "") {
        setting = <h1 style={{ fontSize: 110 }}>{time}</h1>;
    } else {
        setting = (
            // <button
            //     className="btn btn-success"
            //     onClick={() => props.timerCallback()}
            // >
            //     Start Game
            // </button>
            <span onClick={() => props.timerCallback()} class='start-btn-green ff-20 width-250'>START GAME</span>
        )
    }
    return (
        <>
            <h5>{header}</h5>
            {setting}
        </>
    );
}