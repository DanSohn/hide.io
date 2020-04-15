import React from "react";

export default function GameObjective(props) {
    let description = <></>,
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

        description = (
            <>
                <h1>{title}</h1>
                <h5>{subtitle}</h5>
            </>
        );
    }

    return (
        <div className="PlayerText">
            <div className="fade-out-15">{description}</div>
        </div>
    )
}