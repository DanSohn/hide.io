import React from "react";

export default function GameSettings(props) {
    return <div className="roomSettings">
        <h4>Game Mode:</h4>
        <h6>{props.mode}</h6>
        <h4>Time Limit:</h4>
        <h6>{props.time}</h6>
        <h4>Map:</h4>
        <h6>{props.map}</h6>
    </div>
}
