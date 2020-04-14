import React from "react";

export default function PlayerList(props) {
    const players = props.playersList;

    const listItems = players.map((player) =>
        <ListItem key={player.name} player={player}/>
    );

    return (
        <div className="online">
            <ul>{listItems}</ul>
        </div>
    );
}

function ListItem(props){
    return <li style={{listStyleType: "none"}}>{props.player.name}</li>;
}


