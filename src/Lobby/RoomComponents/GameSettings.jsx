import React from "react";

export default function GameSettings(props) {
    return <div className="roomSettings">
        <h6 style={{fontSize: 15}}>Game Mode</h6>
        <h4>{props.mode}</h4>
        <h6 style={{fontSize: 15}} >Time Limit</h6>
        <h4>{props.time}</h4>
        <h6 style={{fontSize: 15}}>Map</h6>
        <h4>{props.map}</h4>
    </div>
}
