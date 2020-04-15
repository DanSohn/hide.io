import React from "react";

export default function GameSettings(props) {
    return <div className="roomSettings">
        <h7>Game Mode</h7>
        <h4>{props.mode}</h4>
        <h7>Time Limit</h7>
        <h4>{props.time}</h4>
        <h7>Map</h7>
        <h4>{props.map}</h4>
    </div>
}
