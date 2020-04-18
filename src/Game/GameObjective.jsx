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
            subtitle = "Objective: Don't get caught!";
        }

        description = (
            <div className="PlayerText fade-out-15">
                <h1>{title}</h1>
                <h5>{subtitle}</h5>
            </div>
        );
    }
    else {
        description = (<></>);
    }

    return (
        <>
            {description}
        </>
    )
}