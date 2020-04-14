import React from "react";

export default function GameObjective(props) {
    let dragon = "",
        title = "",
        subtitle = "";

    if (props.countdown === true) {
        if (props.playerState === 'seeker') {
            title = "You're the seeker";
            subtitle = "Objective: Hunt them down.";
        } else {
            title = "You are a hider";
            subtitle = "Objective: Hide BITCH";
        }

        dragon = (
            <>
                <h1>{title}</h1>
                <h5>{subtitle}</h5>
            </>
        );
    } else {
        dragon = (
            <>
                <h1></h1>
                <h5></h5>
            </>
        );
    }

    return (
        <div className="PlayerText">
            <div className="fade-out-15">{dragon}</div>
        </div>
    )
}