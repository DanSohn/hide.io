import React from "react";

export default function PlayerList(props) {
    const players = props.playersList;

    const listItems = players.map((player) =>
        <ListItem key={player.name} player={player} />
    );

    return (
        <div className=" start-btn-windows online">
            <h4 className="ff">ONLINE</h4>
            <ul>{listItems}</ul>
        </div>
    );
}

function ListItem(props) {
    return <li style={{ listStyleType: "none" }}>{props.player.name}</li>;
}


